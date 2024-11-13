
# 🎓 **Smart Class Routine Management System**

<p align="center">
    <img src="https://github.com/JUCSE49-Mavericks/Smart-Class-Routine-Management-System/blob/main/resources/logo_edited.PNG" alt="project logo">
</p>

 <p align="center"> <a href="https://github.com/JUCSE49-Mavericks/Smart-Class-Routine-Management-System/wiki">
 <img src="https://github.com/JUCSE49-Mavericks/Smart-Class-Routine-Management-System/blob/main/resources/Document.PNG"> </a> </p>

## Our Team

<table>
<tr>
<td align="center">
<a href="https://github.com/Sa-dia">
<img src="https://github.com/JUCSE49-Mavericks/Smart-Class-Routine-Management-System/blob/main/resources/Sadia.jpg" alt="Sadia Hossain" width="120px" height="120px">
</a>
<h4><a href="https://github.com/Sa-dia">Sadia Hossain</a></h4>
<p>Roll: 347</p>
</td>

<td align="center">
<a href="https://github.com/Sumaiya351">
<img src="https://github.com/JUCSE49-Mavericks/Smart-Class-Routine-Management-System/blob/main/resources/Umma.jpg" alt="Umma Sumaiya Jahan" width="120px" height="120px">
</a>
<h4><a href="https://github.com/Sumaiya351">Umma Sumaiya Jahan</a></h4>
<p>Roll: 351</p>
</td>

<td align="center">
<a href="https://github.com/29mitu">
<img src="https://github.com/JUCSE49-Mavericks/Smart-Class-Routine-Management-System/blob/main/resources/mitu.jpg" alt="Jannati Tajrimin" width="120px" height="120px">
</a>
<h4><a href="https://github.com/29mitu">Jannati Tajrimin Mitu</a></h4>
<p>Roll No: 358</p>
</td>

<td align="center">
<a href="https://github.com/TrishaSarkar174">
<img src="https://github.com/JUCSE49-Mavericks/Smart-Class-Routine-Management-System/blob/main/resources/Trisha.jpeg" alt="Trisha Sarkar" width="120px" height="120px">
</a>
<h4><a href="https://github.com/TrishaSarkar174">Trisha Sarkar</a></h4>
<p>Roll No: 359</p>
</td>

<td align="center">
<a href="https://github.com/Akila-Nipo">
<img src="https://github.com/JUCSE49-Mavericks/Smart-Class-Routine-Management-System/blob/main/resources/Akila_Nipo.jpg" alt="Akila Nipo" width="120px" height="120px">
</a>
<h4><a href="https://github.com/Akila-Nipo">Akila Nipo</a></h4>
<p>Roll No: 368</p>
</td>

<td align="center">
<a href="https://github.com/RubayedMunna">
<img src="https://github.com/JUCSE49-Mavericks/Smart-Class-Routine-Management-System/blob/main/resources/Rubayed.jpg" alt="Rubayed All Islam" width="120px" height="120px">
</a>
<h4><a href="https://github.com/RubayedMunna">Rubayed All Islam</a></h4>
<p>Roll No: 370</p>
</td>
</tr>
</table>
---

## 🏆 `Main Functions of the Project`

The following core functionalities are designed to streamline and enhance the Smart Class Routine Management System:

1. **User Login**
   
3. **View Personalized Dashboard**
4. **Generate Class Routine**
5. **Generate Makeup Routine**
6. **View Academic Calendar**
7. **Assign Course Teacher**
8. **Schedule Class**
9. **Filter Syllabus**
10. **Upload Files**
11. **Request Rescheduling**
12. **View Class Routine**
13. **Approve Rescheduling**
14. **View Class Representative Info**
15. **Update Class Representative Info**

 ---

## 🛠️ **`How to Use`**

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

- **⚠️ App doesn’t load?**  
  Ensure that both **[Node.js](https://nodejs.org/)** and **MySQL** are properly installed and running.  
  You can check **Node.js** by running:

    ```bash
    node -v
    ```

  If the app is still not loading, verify if your **MySQL** server is up and running.  
  You can check the status of MySQL or restart the service depending on your system.

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
