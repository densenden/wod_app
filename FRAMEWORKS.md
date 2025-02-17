# **FRAMEWORKS.md**

## **Project Plan: Universal WOD & Signage System**

This document outlines the technologies and frameworks used in different phases of the **Universal WOD & Signage System** development.

---

## **🚀 Phase 1: MVP – Core Web System**

### **Goal:**  
Load structured data (e.g., WODs) from a JSON file, dynamically format it, and display it on a responsive web interface.

### **Key Features:**  
- **Data Import:** Load structured content (WODs, schedules, instructions) from JSON.  
- **Smart Layout:** Auto-generated grid for perfect formatting on any screen size.  
- **Dynamic Font Sizing:** Content scales intelligently for readability.  
- **Emphasized Highlights:** Important details (e.g., times, reps) stand out visually.  
- **Web Deployment:** Hosted as an accessible website for instant updates.  
- **Python Backend:** Scripts for managing, updating, and syncing content.

### **Technologies & Frameworks:**
- **Backend:** Flask (Python web framework)
- **Frontend:** React (with Next.js for SSR & performance) or Vue.js
- **Data Handling:** JSON (initially), later move to a database like SQLite or Firebase
- **Hosting:** Vercel (for frontend), Render or Railway (for Flask backend)
- **Styling:** TailwindCSS or Chakra UI

### **Flask Integration:**
- Provide API endpoints for structured JSON import
- Server-side rendering of dynamic layouts
- Caching mechanisms for improved performance

---

## **📲 Phase 2: Apple Ecosystem Expansion**

### **Goal:**  
Extend the system to native Apple platforms for seamless interaction, including iPhone, Apple Watch, macOS, and Apple TV.

### **Key Features:**  
- **iPhone & Apple Watch App:** Quick access and WOD display on wearables.  
- **macOS Manager App:** Edit and control signage directly from Mac.  
- **Apple TV Display Mode:** Streamlined big-screen mode for gyms & studios.

### **Technologies & Frameworks:**
- **iOS/macOS App:** SwiftUI (for UI components)
- **Apple Watch:** watchOS (using Swift for WatchOS development)
- **Apple TV:** tvOS (using Swift for Apple TV apps)
- **Data Synchronization:** Flask as the backend API, Firebase or CloudKit for real-time syncing
- **Push Notifications:** WebSockets via Flask-SocketIO for real-time content updates

### **Flask Integration:**
- Expose REST API endpoints to serve WOD and signage content to iOS/macOS apps
- Implement real-time updates using Flask-SocketIO
- User authentication & management (OAuth or Firebase Auth)

---

## **🌍 Phase 3: Universal Signage Solution**

### **Goal:**  
Expand beyond fitness—enable the system for wayfinding, events, and dynamic digital signage.

### **Key Features:**  
- **Fitness & Gym Displays:** Displays for CrossFit, Yoga, Wellness, Massage, etc.  
- **Wayfinding & Event Signage:** Venue maps, conference schedules, guest info.  
- **Cloud-Based Instant Updates:** Manage content remotely from any device.  
- **Theming & Customization:** Customizable templates for different industries.  
- **Freemium Model:** Free version with ads, premium version for businesses.

### **Technologies & Frameworks:**
- **Universal Displays:** Web-based apps for Raspberry Pi, Smart TVs, Tablets
- **Cross-Platform Development:** Electron.js or Flutter (for building cross-platform desktop apps)
- **Cloud Integration:** Google Firebase or Supabase for database & real-time syncing
- **Voice Control:** Integration with Siri, Google Assistant, or Alexa

### **Flask Integration:**
- Multi-device API with device-specific UI customization
- AI-powered content adjustment (using GPT or Whisper for automated text entry)
- Offline mode with local Flask servers (ideal for devices like Raspberry Pi)

---

## **Conclusion:**

Flask is an excellent choice for the backend in the early phases of the project due to its lightweight nature and simplicity. For real-time data handling and cross-platform integration, solutions like Firebase or FastAPI might be considered in Phase 3 as the project scales.  