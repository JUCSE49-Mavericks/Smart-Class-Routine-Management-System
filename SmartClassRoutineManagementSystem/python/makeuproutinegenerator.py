import random

# Define available data
courses = ['Math', 'Physics', 'Chemistry', 'Biology']
instructors = {'Math': 'Dr. A', 'Physics': 'Dr. B', 'Chemistry': 'Dr. C', 'Biology': 'Dr. D'}
rooms = {'Room 1': 50, 'Room 2': 30, 'Room 3': 40}
time_slots = ['Mon 9-10', 'Mon 10-11', 'Tue 9-10', 'Tue 10-11', 'Wed 9-10', 'Wed 10-11']
class_types = {'Math': 'Lecture', 'Physics': 'Lecture', 'Chemistry': 'Lab', 'Biology': 'Lecture'}

# Define constraints
instructor_availability = {
    'Dr. A': ['Mon 9-10', 'Tue 10-11'],
    'Dr. B': ['Mon 10-11', 'Wed 9-10'],
    'Dr. C': ['Mon 9-10', 'Tue 9-10'],
    'Dr. D': ['Tue 9-10', 'Wed 10-11']
}

room_assignments = {
    'Math': 'Room 1',
    'Physics': 'Room 2',
    'Chemistry': 'Room 3',
    'Biology': 'Room 2'
}

# Helper function to check room availability
def is_room_available(room, time_slot, routine):
    assigned_rooms = [entry['Room'] for entry in routine if entry['Time Slot'] == time_slot]
    return room not in assigned_rooms

# Helper function to check instructor availability
def is_instructor_available(instructor, time_slot):
    return time_slot in instructor_availability[instructor]

# Function to generate routine
def generate_routine():
    routine = []
    
    for course in courses:
        instructor = instructors[course]
        available_slots = instructor_availability[instructor]
        
        # Find available slots that are in both instructor's availability and global time slots
        possible_slots = list(set(available_slots) & set(time_slots))
        
        if not possible_slots:
            print(f"No available slots for {course} with {instructor}.")
            continue
        
        time_slot = random.choice(possible_slots)
        room = room_assignments[course]
        
        if is_room_available(room, time_slot, routine) and is_instructor_available(instructor, time_slot):
            routine.append({
                'Course': course,
                'Instructor': instructor,
                'Room': room,
                'Time Slot': time_slot,
                'Class Type': class_types[course]
            })
            time_slots.remove(time_slot)
        else:
            print(f"Could not assign {course} due to room or instructor conflict at {time_slot}.")

    return routine

# Generate and print the routine
routine = generate_routine()
for entry in routine:
    print(f"{entry['Course']} ({entry['Class Type']}) - {entry['Instructor']} - {entry['Room']} - {entry['Time Slot']}")
