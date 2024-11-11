import random
from datetime import datetime, timedelta
import json

class MakeupClassSchedule:
    def __init__(self, classes_needed, slot_duration_minutes=60, max_classes_per_day=2):
        self.start_time = datetime.strptime("09:00", "%H:%M")
        self.end_time = datetime.strptime("16:00", "%H:%M")
        self.slot_duration = timedelta(minutes=slot_duration_minutes)
        self.max_classes_per_day = max_classes_per_day
        self.classes_needed = classes_needed
        self.weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"]
        self.population_size = 100
        self.generations = 50

    def generate_initial_population(self):
        population = []
        for _ in range(self.population_size):
            individual = []
            classes_left = self.classes_needed
            for day in self.weekdays:
                day_slots = []
                num_classes_today = min(classes_left, random.randint(0, self.max_classes_per_day))
                for _ in range(num_classes_today):
                    slot_time = self.random_slot_time()
                    day_slots.append(slot_time)
                individual.append((day, day_slots))
                classes_left -= num_classes_today
            population.append(individual)
        return population

    def random_slot_time(self):
        available_slots = int((self.end_time - self.start_time) / self.slot_duration)
        slot_index = random.randint(0, available_slots - 1)
        slot_start = self.start_time + slot_index * self.slot_duration
        slot_end = slot_start + self.slot_duration
        return (slot_start.strftime("%H:%M"), slot_end.strftime("%H:%M"))

    def fitness(self, individual):
        penalty = 0
        for day, slots in individual:
            if len(slots) > self.max_classes_per_day:
                penalty += (len(slots) - self.max_classes_per_day) * 5
        return -penalty

    def crossover(self, parent1, parent2):
        crossover_point = random.randint(1, len(self.weekdays) - 1)
        child1 = parent1[:crossover_point] + parent2[crossover_point:]
        child2 = parent2[:crossover_point] + parent1[crossover_point:]
        return child1, child2

    def mutate(self, individual):
        day_to_mutate = random.randint(0, len(self.weekdays) - 1)
        individual[day_to_mutate] = (self.weekdays[day_to_mutate], [self.random_slot_time()])
        return individual

    def select_parents(self, population):
        sorted_population = sorted(population, key=self.fitness, reverse=True)
        return sorted_population[:2]

    def generate_schedule(self):
        population = self.generate_initial_population()
        for _ in range(self.generations):
            new_population = []
            for _ in range(self.population_size // 2):
                parent1, parent2 = self.select_parents(population)
                child1, child2 = self.crossover(parent1, parent2)
                
                if random.random() < 0.1:
                    child1 = self.mutate(child1)
                if random.random() < 0.1:
                    child2 = self.mutate(child2)
                    
                new_population.extend([child1, child2])
                
            population = new_population
        
        best_schedule = max(population, key=self.fitness)
        # Transform the schedule into the desired format (array of objects)
        formatted_schedule = []
        for day, slots in best_schedule:
            for slot in slots:
                formatted_schedule.append({
                    "day": day,
                    "room": f"Room {random.randint(101, 999)}",  # Random room for now
                    "time": f"{slot[0]} - {slot[1]}"
                })
        return formatted_schedule

if __name__ == "__main__":
    import sys
    classes_needed = int(sys.argv[1])
    schedule = MakeupClassSchedule(classes_needed)
    best_schedule = schedule.generate_schedule()
    print(json.dumps(best_schedule, indent=2))
