# Livechat Documentation

## Introduction <a name="introduction"></a>
Livechat is a web-based chat application developed by Maalzates. It allows users to chat with each other in real-time. This documentation provides instructions for installing and using the Livechat application, as well as a list of its features and information on how to contribute to the project.
## Installation <a name="installation"></a>
To install the Livechat application, follow these steps:
1. Clone the GitHub repository:
```
git clone https://github.com/maalzates/livechat.git
```
2. Install the required dependencies:
```
npm install
```
3. Start the application:
```
npm start
```
4. Open your web browser and go to `http://localhost:3000` to access the Livechat application.
#
### Project Structure
The project structure follows a standard Vue.js application structure. Here is an overview of the key directories and files:
- `client`: Contains the index.html which is the base view of the chat.
- `server`: Contains the node.js server logic.
- `database`: Cotnains the .db file used for persisting the data using sqlite3. 
  
## Contributing <a name="contributing"></a>
If you would like to contribute to the development of the Livechat application, follow these steps:
1. Fork the GitHub repository.
2. Clone your forked repository:
```
git clone https://github.com/your-username/livechat.git
```
3. Create a new branch for your feature or bug fix:
```
git checkout -b new-feature
```
4. Make your changes to the code.
5. Commit your changes:
```
git commit -m "Add new feature"
```
6. Push your changes to your forked repository:
```
git push origin new-feature
```
7. Create a pull request on the original repository to propose your changes for review.
## License <a name="license"></a>
The Livechat application is released under the [MIT](https://opensource.org/licenses/MIT) license
