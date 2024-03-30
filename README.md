# crib_project
Group Software Project for CSC-307.  

**Contributors:**  
Luke Waltz, Kylie ODonnell, Bryce Raymundo, Tyler Baxter  

**Project Topic:**  
An app that streamlines the complexities that come with living with roommates.
This app includes functionality to post, claim, and delete tasks within a house group, and an anonymous polling feature for disagreements within house groups. Check out our demo video for more info!

**Product Vision:**  
For housemates who need to efficiently and effectively communicate chores and tasks around living areas
(trash, organization, and cleaning), Crib is an organization and communication app that encourages good 
communication from housemate to housemate. The key benefit to using our application is its intuitive and 
easy way to delegating and assigning household tasks. Unlike Dwell (the competing app), we also have anonymous 
polls that roommates can vote on so disputes can be settled calmly. 
  
**Project Links:**  
UI Prototype: https://www.figma.com/file/86ziJabeijFvcQq8egcINK/cribs?type=design&node-id=0%3A1&mode=design&t=cky5cklEXrp2IU7x-1  
Class Diagrams: https://drive.google.com/file/d/1Hho7h9R9o9_OgPqr5O75oNRk2CiaTRNN/view?usp=sharing  
Demo Video: https://clipchamp.com/watch/8rjhxkdDNXn  
Final Slides: https://docs.google.com/presentation/d/17tBHxGP-7T_O9Ul_dJdRGHj_lSv50PDgaoZ-PnZvrBM/edit?usp=sharing  
  
**Contributing:**  
If you haven't installed ESLint either locally or globally do so by running npm install eslint in the workspace
folder for a local install or npm install -g eslint for a global install.  
Prettier: Install through VS Code extensions. Search for Prettier - Code formatter.  
Install dependencies with 'npm i' in the crib-project directory.  
Run locally with 'npm start' in both express-backend and react-frontend directories.  

**Jest Unit Testing**  
![testsSS](https://github.com/lukewaltz/crib_project/assets/66276398/a8b8afb4-0a45-459a-a42d-62355198d4fc)
  
**Design Standards:**  
1. React UI component’s names should be PascalCase.  
2. All other helper files should be camelCase. (non-component files)  
3. All the folder names should be camelCase.  
4. CSS class names should use a standard naming convention.  
5. Use the DRY principle (Don't repeat yourself).  
6. Create multiple files instead of writing a big file. (Componentization of code: fix to small functionality for each file)  
7. Avoid Inline CSS as and when possible (a CSS class should be created when there are more than 2 CSS attributes).  
8. Use ESLint to make your code easier to review. Follow strict linting rules. This in turn helps you write clean, consistent code.  
9. Review your code before creating a pull request.  
10. Name your files logically according to the job that they perform.  
11. Destructuring your props is a good way to help make your coder cleaner and more maintainable.

**Deployment Links:** (inactive - faced extensive problems with CD)  
Azure Frontend: https://black-beach-047e9eb1e.4.azurestaticapps.net/  
Azure Backend: https://crib-app.azurewebsites.net/  
