import json
import os
from datetime import datetime

DATA_DIR = "../data"
CONFIG_FILE = "../config/config.json"

class Workout:
    def __init__(self, warmup, strength, wod, accessory, mobility=None, cooldown=None, conditioning=None, team_wod=None):
        self.warmup = warmup
        self.strength = strength
        self.wod = wod
        self.accessory = accessory
        self.mobility = mobility
        self.cooldown = cooldown
        self.conditioning = conditioning
        self.team_wod = team_wod

    def to_dict(self):
        return {
            "warmup": self.warmup,
            "strength": self.strength,
            "wod": self.wod,
            "accessory": self.accessory,
            "mobility": self.mobility,
            "cooldown": self.cooldown,
            "conditioning": self.conditioning,
            "team_wod": self.team_wod
        }

class Gym:
    def __init__(self, name):
        self.name = name
        self.wods = []

    def add_workout(self, workout):
        self.wods.append(workout.to_dict())

    def to_dict(self):
        return {"name": self.name, "wods": self.wods}

def list_available_gyms():
    gyms = [f for f in os.listdir(DATA_DIR) if f.endswith('.json')]
    print("Available Gym Datasets:")
    for gym in gyms:
        print(f"- {gym}")

def create_new_gym():
    gym_name = input("Enter Gym Name: ").strip().replace(" ", "_").lower()
    file_path = os.path.join(DATA_DIR, f"{gym_name}.json")

    default_wods = []
    use_default = input("Use default CrossFit.com WODs? (y/n): ").strip().lower()

    if use_default == "y":
        with open(os.path.join(DATA_DIR, "default_wods.json"), "r") as f:
            default_wods = json.load(f)["wods"]

    gym = Gym(gym_name)
    if use_default == "y":
        for wod in default_wods:
            gym.add_workout(Workout(**wod))

    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(gym.to_dict(), f, indent=4)

    print(f"Gym {gym_name} created successfully.")

def edit_gym_wod():
    list_available_gyms()
    gym_file = input("Enter Gym JSON filename: ").strip()
    file_path = os.path.join(DATA_DIR, gym_file)

    if not os.path.exists(file_path):
        print("File not found!")
        return

    with open(file_path, "r", encoding="utf-8") as f:
        gym_data = json.load(f)

    day = int(input("Enter WOD Day (1-365): "))
    if day < 1 or day > 365:
        print("Invalid day!")
        return

    warmup = input("Enter new Warm-Up: ").strip()
    strength = input("Enter new Strength: ").strip()
    wod = input("Enter new WOD: ").strip()
    accessory = input("Enter new Accessory: ").strip()
    mobility = input("Enter new Mobility (optional, press Enter to skip): ").strip() or None
    cooldown = input("Enter new Cooldown (optional, press Enter to skip): ").strip() or None
    conditioning = input("Enter new Conditioning (optional, press Enter to skip): ").strip() or None
    team_wod = input("Enter new Team WOD (optional, press Enter to skip): ").strip() or None

    gym_data["wods"][day - 1] = Workout(warmup, strength, wod, accessory, mobility, cooldown, conditioning, team_wod).to_dict()

    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(gym_data, f, indent=4)

    print(f"WOD for Day {day} updated successfully.")

if __name__ == "__main__":
    print("\n1. List available Gyms\n2. Create new Gym\n3. Edit Gym WOD")
    choice = input("Choose an option: ").strip()

    if choice == "1":
        list_available_gyms()
    elif choice == "2":
        create_new_gym()
    elif choice == "3":
        edit_gym_wod()
    else:
        print("Invalid choice!")