
# 🎓 **Smart Class Routine Management System**

<p align="center">
    <img src="https://github.com/JUCSE49-Mavericks/Smart-Class-Routine-Management-System/blob/main/resources/logo_edited.PNG" alt="project logo">
</p>

 <p> <a href="https://github.com/JUCSE49-Mavericks/Smart-Class-Routine-Management-System/wiki">
 <img src="https://github.com/JUCSE49-Mavericks/Smart-Class-Routine-Management-System/blob/main/resources/Document.PNG"> </a> </p>


## 🛠️ **How to Use**

### 1. **`Clone the Project`**
- Install **[Git Bash](https://git-scm.com/)** (if not already installed).
- Open the **Git Bash** terminal in your local directory.
- Configure **Git**:

    ```bash
    git config --global user.name "<github_username>"
    git config --global user.email "<github_email>"
    ```

- Clone the project by running:

    ```bash
    git clone https://github.com/JUCSE49-Mavericks/Smart-Class-Routine-Management-System.git
    ```

### 2. **`Navigate to the Project Directory`**
- Go to the project directory:

    ```bash
    cd SmartClassRoutineManagementSystem
    ```

- Open the project in **[VS Code](https://code.visualstudio.com/)**:

    ```bash
    code .
    ```

- Open the terminal in VS Code (`Ctrl + J`).

### 3. **`Install Dependencies`**
- Install all the required dependencies by running:

    ```bash
    npm install
    ```

### 4. **`Configure the Database`**
- **`Set Up MySQL`**: Open your MySQL client (e.g., **[phpMyAdmin](https://www.phpmyadmin.net/)**, **[MySQL Workbench](https://www.mysql.com/products/workbench/)**, or the command line).
- Create a new database for the application:

    ```sql
    CREATE DATABASE smart_class_routine;
    ```

- In the project folder, create a `.env` file and add the following configuration:

    ```plaintext
    DB_HOST=localhost
    DB_USER=your_mysql_username
    DB_PASSWORD=your_mysql_password
    DB_NAME=smart_class_routine
    PORT=3000
    ```

- Save and close the file.

### 5. **`Import Database Tables`**
- If a **SQL file** (e.g., `smart_class_routine.sql`) is provided, import it into the `smart_class_routine` database using **phpMyAdmin** or **MySQL Workbench** to set up the required tables.

---

## 🚀 **`Running the Application`**

### 1. **`Start the Application`**
- To start the application, run the following command:

    ```bash
    node server.js
    ```

---

## 🧑‍💻 **`How to Develop`**

### 1. **`Create a New Branch`**
- To start working on a new feature or bug fix, create a new branch:

    ```bash
    git checkout -b <new_branch_name>
    ```

### 2. **`Make Changes`**
- Implement your changes.
- If you need to modify the database structure (e.g., adding new tables), run:

    ```bash
    npm run migrate
    ```

- **`Run tests`** to ensure everything works:

    ```bash
    npm test
    ```

### 3. **`Commit and Push Changes`**
- Stage and commit your changes:

    ```bash
    git add .
    git commit -m "Description of changes made"
    ```

- Push the changes to the remote repository:

    ```bash
    git push origin <new_branch_name>
    ```

### 4. **`Create a Pull Request`**
- After pushing your branch, create a **[Pull Request](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request)** to merge your changes into the main development branch.

### 5. **`Review and Merge`**
- Collaborators will review changes in the Pull Request.
- If approved, merge the changes into the main branch.

### 6. **`Update Local Repository`**
- After the merge, make sure your local repository is up to date:

    ```bash
    git checkout main
    git pull origin main
    ```

- Optionally, delete the local feature branch after merging:

    ```bash
    git branch -d <new_branch_name>
    ```

---

## 🛠️ **`Troubleshooting`**

- **❌ Error connecting to the database?**  
  Double-check your `.env` file to ensure the correct **database configurations**. Ensure that:
  - **`DB_HOST`** points to the correct MySQL server (usually `localhost` for local setups).
  - **`DB_USER`** and **`DB_PASSWORD`** match your MySQL credentials.
  - **`DB_NAME`** is correctly set to the database you're using for this app.

- **⚠️ App doesn’t load?**  
  Ensure that both **[Node.js](https://nodejs.org/)** and **MySQL** are properly installed and running.  
  You can check **Node.js** by running:

    ```bash
    node -v
    ```

  If the app is still not loading, verify if your **MySQL** server is up and running.  
  You can check the status of MySQL or restart the service depending on your system.

- **🔑 Missing environment variables?**  
  If certain **environment variables** are missing or incorrect, the application may fail to start.  
  Ensure that the **`.env`** file is properly set up with:
  - Correct **MySQL** database connection details (**`DB_HOST`**, **`DB_USER`**, **`DB_PASSWORD`**, **`DB_NAME`**).
  - The **PORT** is set to `3000` (or your preferred port).
  
---

## 🎉 **Enjoy using the Smart Class Routine Management System!**

We hope the system helps you streamline your class scheduling process! If you have any questions or need support, feel free to reach out to us.  
We’re happy to assist you! 🤝

---

## 🤝 **Contributing**

**We welcome contributions** to improve the **Smart Class Routine Management System**! Whether you want to add new features, fix bugs, or improve documentation, we’re excited to collaborate with you.

### To contribute:
1. **Fork** the repository.
2. **Create a new branch** for your feature or bug fix.
3. **Implement your changes**.
4. **Test everything thoroughly** to ensure stability.
5. Open a **Pull Request** to merge your changes into the main repository.


Your **contributions** are greatly appreciated, and we thank you for helping make the project even better! 🙌

---
