# Dependencies
I am using [Bower][1] to manage external dependencies for the project.
To fetch them just run `bower install` in the root folder.

## Contributing
Please do your work in your own branch, and then send a pull request to merge in your changes into the development branch. This will help make it easier for us to individually work on stuff.

## Issues
It would also be benefitial to make an issue if we want to organize who is working on what or if we want to add changes or anything like that.

## Project Structure
I have changed the structure because I am going to have this deploy to [Heroku][2] after we push to this branch to make it easier and automated to deploy and test on a remote server.
I have moved the actual app into the `web` folder, the rest of it is just stuff for heroku to use for deployment info.
The URL to access the deployed site is [here][3]

[1]: http://bower.io/
[2]: http://heroku.com
[3]: https://ontrack-csc360.herokuapp.com
