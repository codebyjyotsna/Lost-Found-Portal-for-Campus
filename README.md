# Lost-Found-Portal-for-Campus
A web application that allows students to post and search for lost or found items on campus. The platform supports image uploads, fuzzy search, and notifications for matching posts.
## Features
1. **User Authentication**:  
   Students can register/login using their email or student ID.  
   - **Tech**: JWT-based authentication.
2. **Post Lost/Found Items**:  
   Students can post details of lost or found items, including:  
   - Title  
   - Description  
   - Tags (e.g., "bag", "watch")  
   - Location  
   - Images (uploaded via Cloudinary)  
   - Contact Information  
3. **Search with Fuzzy Matching**:  
   Use a powerful search bar to find posts based on keywords.  
   - **Tech**: MongoDB text indexes with fuzzy matching.
4. **Filtering and Sorting**:  
   - Filter by category (Lost/Found).  
   - Sort by date (newest/oldest).  
5. **User Dashboard**:  
   Each user can view, edit, or delete their own posts.
6. **Admin Moderation**:  
   Admins can approve or reject posts to ensure content quality.
7. **Notifications for Matching Posts**:  
   Users are notified when a new post matches their lost/found item criteria.  
   - **Tech**: Email notifications via Nodemailer.
8. **Chat Feature**:  
   Users can communicate with each other via an in-app messaging system.
