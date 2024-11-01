const db = require('../../config/db');


/**
 * Controller for processing input and generating TIME SLOTS based on department details and preferences.
 */
class RoutineInputProcessor {

    /**
     * Processes routine input and generates a schedule based on the provided department details and preferences.
     * 
     * @param {Object} scheduleDetails - Contains department, slot count, duration, times, and lunch preferences.
     * @returns {Promise<Object>} - The generated schedule data.
     */
    async processSchedule(scheduleDetails) {
        const { department, slotCount, slotDuration, startTime, endTime, lunchDuration, lunchTime } = scheduleDetails;

        console.log("Start processing schedule generation request...");

        this.validateParameters(department, slotCount, slotDuration, startTime, endTime, lunchDuration, lunchTime);

        console.log('Parameters received for schedule generation:', scheduleDetails);
        console.log('Generating schedule...');

        const generatedSchedule = await this.createSchedule(department, slotCount, slotDuration, startTime, endTime,
         lunchDuration, lunchTime);
        
        console.log('Schedule generated successfully:', generatedSchedule);
        return generatedSchedule;
    }

    /**
     * Validates required parameters for schedule generation.
     * 
     * @param {string} department - The department for which the schedule is generated.
     * @param {number} slotCount - The total number of slots to generate.
     * @param {number} slotDuration - The duration of each slot in minutes.
     * @param {string} startTime - The start time of the schedule in HH:MM format.
     * @param {string} endTime - The end time of the schedule in HH:MM format.
     * @param {number} lunchDuration - The duration of the lunch break in minutes.
     * @param {string} lunchTime - The start time of the lunch break in HH:MM format.
     * @throws {Error} Will throw an error if any required parameters are missing.
     */
    validateParameters(department, slotCount, slotDuration, startTime, endTime, lunchDuration, lunchTime) {
        if (!department || !slotCount || !slotDuration || !startTime || !endTime || !lunchDuration || !lunchTime) {
            console.error('Error: Missing required parameters.');
            throw new Error('Missing required parameters.');
        }
    }

    /**
     * Distributes the SLOTS based on the provided details.
     * 
     * @param {string} department - The department for which the schedule is generated.
     * @param {number} slotCount - The total number of slots to generate.
     * @param {number} slotDuration - The duration of each slot in minutes.
     * @param {string} startTime - The start time of the schedule in HH:MM format.
     * @param {string} endTime - The end time of the schedule in HH:MM format.
     * @param {number} lunchDuration - The duration of the lunch break in minutes.
     * @param {string} lunchTime - The start time of the lunch break in HH:MM format.
     * @returns {Promise<Object>} - The generated schedule data.
     * @throws {Error} Will throw an error if there is an issue during schedule creation.
     */
    async createSchedule(department, slotCount, slotDuration, startTime, endTime, lunchDuration, lunchTime) {
        console.log(`Creating schedule for department: ${department}`);

        try {
            const lunchEndTime = this.calculateSlotTime(lunchTime, lunchDuration, 1);
            const slots = [];

            let currentTime = startTime;
            let slotIndex = 1; // To keep track of slot numbers

            // Schedule slots before lunch
            while (slotIndex <= slotCount && this.isTimeBefore(currentTime, lunchTime)) {
                const currentSlotEnd = this.calculateSlotTime(currentTime, slotDuration, 1);

                // Prevent scheduling beyond lunch time
                if (this.isTimeBefore(currentSlotEnd, lunchTime) || currentSlotEnd === lunchTime) {
                    slots.push(this.createSlot(currentTime, currentSlotEnd, slotDuration, slotIndex));
                    currentTime = currentSlotEnd;
                    slotIndex++;
                } else {
                    break; // Stop if the next slot would start after lunch
                }
            }

            // Ensure the lunch break is placed after the last slot before lunch
            if (slotIndex > 1) { // At least one slot must have been created before lunch
                console.log(`Lunch Break: Start Time: ${lunchTime}, End Time: ${lunchEndTime}, 
                Duration: ${lunchDuration} minutes`);
            }

            // Schedule slots after lunch
            currentTime = lunchEndTime; // Start scheduling after the lunch break
            while (slotIndex <= slotCount && this.isTimeBefore(currentTime, endTime)) {
                const currentSlotEnd = this.calculateSlotTime(currentTime, slotDuration, 1);

                if (this.isTimeBefore(currentSlotEnd, endTime) || currentSlotEnd === endTime) {
                    slots.push(this.createSlot(currentTime, currentSlotEnd, slotDuration, slotIndex));
                    currentTime = currentSlotEnd;
                    slotIndex++;
                } else {
                    break; // Prevent scheduling beyond end time
                }
            }

            const scheduleData = {
                department,
                slots,
                lunchBreak: {
                    duration: lunchDuration,
                    startTime: lunchTime,
                    endTime: lunchEndTime,
                },
            };

            console.log('Schedule creation completed:', scheduleData);
            return scheduleData;

        } catch (error) {
            console.error('Error in createSchedule:', error);
            throw new Error('Error while creating schedule.');
        }
    }

    /**
     * Creates a slot object.
     * 
     * @param {string} startTime - The start time of the slot in HH:MM format.
     * @param {string} endTime - The end time of the slot in HH:MM format.
     * @param {number} duration - The duration of the slot in minutes.
     * @param {number} slotNumber - The number assigned to the slot.
     * @returns {Object} - The created slot object.
     */
    createSlot(startTime, endTime, duration, slotNumber) {
        return {
            slotNumber: slotNumber,
            duration: duration,
            startTime: startTime,
            endTime: endTime,
        };
    }

    /**
     * Calculates the end time based on the start time and duration.
     * 
     * @param {string} startTime - The start time in HH:MM format.
     * @param {number} duration - The duration to add in minutes.
     * @param {number} slotIndex - The index of the current slot.
     * @returns {string} - The calculated end time in HH:MM format.
     */
    calculateSlotTime(startTime, duration, slotIndex) {
        const [hours, minutes] = startTime.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes + duration * slotIndex;
        const resultHours = Math.floor(totalMinutes / 60) % 24;
        const resultMinutes = totalMinutes % 60;

        return `${String(resultHours).padStart(2, '0')}:${String(resultMinutes).padStart(2, '0')}`;
    }

    /**
     *Throughout the scheduling process, this function is used to check:
     *       If the current time for a slot is before the designated lunch time.
     *      If a slot's end time is before the overall end time of the schedule.
     *       This ensures that the generated schedule respects the start and end times, as well as the lunch break.
     * 
     * @param {string} time1 - The first time in HH:MM format.
     * @param {string} time2 - The second time in HH:MM format.
     * @returns {boolean} - True if the first time is before the second, otherwise false.
     */
    isTimeBefore(time1, time2) {
        const [hours1, minutes1] = time1.split(':').map(Number);
        const [hours2, minutes2] = time2.split(':').map(Number);
        return (hours1 < hours2) || (hours1 === hours2 && minutes1 < minutes2);
    }
}

module.exports = RoutineInputProcessor; // Export the updated class
