# 🚀 Storyku - Modern Story Management System

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)

## <a name="introduction"></a> Introduction :

**Storyku** is a full-stack web application designed to help writers and content creators manage their stories effectively. Built with a modern tech stack, it allows users to organize stories, manage chapters, and track publication status (Draft/Publish) through an intuitive and responsive dashboard.

The application focuses on a clean user experience (UX) with features like sticky headers, modal alerts, and a modern "Plus Jakarta Sans" typography to ensure a comfortable writing management environment.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Libraries](#libraries)
- [Project Structure](#project-structures)
- [Website URL](#apk-link)

## <a name="features"></a> Features :

### 🔹 Dashboard & Overview
- **Hero Banner:** A modern welcome screen with statistical summaries.
- **Visual Grid:** Display stories in an aesthetic card layout with cover images.
- **Quick Filters:** Filter stories by Category (Financial, Technology, Health) and Status directly from the sticky header.

### 🔹 Story Management (CRUD)
- **Story List:** A comprehensive table view with search and advanced filtering capabilities.
- **Add Story:** Create new stories with cover image uploads and dynamic tag/keyword inputs.
- **Edit Story:** Update story details and cover images with autofilled forms.
- **Delete Story:** Secure deletion with confirmation modals.

### 🔹 Chapter Management
- **Chapter List:** Manage multiple chapters within a story.
- **Add & Edit Chapter:** Full create and update functionality for story chapters.
- **Rich Text Support:** (Ready structure for WYSIWYG integration).

### 🔹 UI/UX Enhancements
- **Responsive Design:** Fully responsive layout for various screen sizes.
- **Custom Modals:** Replaced default browser alerts with beautiful, animated modal popups for success, error, and confirmation messages.
- **Loading States:** dedicated Preloader and loading skeletons for smoother data fetching.

## <a name="libraries"></a> Libraries :

**Frontend:**
- `react`: Core UI library.
- `react-router-dom`: For seamless single-page application navigation.
- `axios`: For handling HTTP requests to the backend.
- `tailwindcss`: For modern, utility-first styling.
- `react-icons`: For vector icons (FontAwesome, Bootstrap icons, etc).
- `vite`: Fast build tool and development server.

**Backend:**
- `express`: Web framework for Node.js.
- `mysql2`: MySQL client for database connection.
- `multer`: Middleware for handling `multipart/form-data` (Image Uploads).
- `cors`: To enable Cross-Origin Resource Sharing.
- `body-parser`: To parse incoming request bodies.
- `nodemon`: For automatic server restarting during development.

## <a name="project-structures"></a> Project Structure :

This project follows a clean separation of concerns structure:

* `assets` - Stores static files like global CSS and images.
* `components` - Reusable UI parts such as `ModalAlert.jsx` and `Preloader.jsx`.
* `pages` - Main view controllers including `Dashboard`, `StoryList`, `AddStory`, `EditStory`, `AddChapter`, and `StoryDetail`.
* `uploads` - (Backend) Storage directory for uploaded story cover images.
* `utils` - (Optional) Helper functions for formatting dates or data processing.

## <a name="apk-link"></a> Website URL :

You can view the live demo here:

- **Live Demo Website:** [https://kalshios.com/harisproject/]
- **Demo Video (YouTube):** [https://youtu.be/-wg6iz9PvRM]  

---
*Created by ABDUL HARIS MUHASIBI for Internship Submission Challenge.*