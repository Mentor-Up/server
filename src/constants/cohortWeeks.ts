import { CohortSubject } from '../models/Cohort';

const nodeWeeks = [
  'Week 0 - Pre Class',
  'Week 1 - Node Introduction',
  'Week 2 - NPM and Async Patterns',
  'Week 3 - Introduction to Express',
  'Week 4 - Middleware, REST Methods, and Postman',
  'Week 5 - Task Manager API Part 1',
  'Week 6 - Task Manager API Part 2',
  'Week 7 - Using Query Parameters',
  'Week 8 - JWT Basics',
  'Week 9 - Jobs API Part 1',
  'Week 10 - Jobs API Part 2',
  'Week 11 - Catch Up Week',
  'Week 12 - A Front End for the Jobs API',
  'Week 13 - Server Side Rendering with EJS',
  'Week 14 - Authentication with Passport',
  'Week 15 - Testing with Mocha and Chai',
  'Week 16 - Final Project Begins',
  'Week 17 - Final Project Completed',
  'Week 18 - Final Project Presentations',
];

const reactWeeks = [
  'Week 0 - Pre Class',
  'Week 1 - Project Setup and React basics',
  'Week 2 - React DOM and Components',
  'Week 3 - Props, State, and Handlers',
  'Week 4 - Review',
  'Week 5 - Lifting State and Props Handling',
  'Week 6 - Hooks and Fragments',
  'Week 7 - Reusable Components, Imperative React',
  'Week 8 - Asynchronous Data, Conditional Rendering and Impossible State',
  'Week 9 - Review/Catch Up Week',
  'Week 10 - Data Fetching, Data Refetching, Memoized Handlers',
  'Week 11 - Third-Party Libraries, Async/Await, Forms',
  'Week 12 - React Router, Class Components',
  'Week 13 - CSS, Styled Components, SVG',
  'Week 14 - Review/Catch Up Week',
  'Week 15 - Performance, Typescript, Testing, Project Structure',
  'Week 16 - Sorting, Searches, Pagination',
  'Week 17 - Final Project Work Completion',
  'Week 18 - Final Project Presentations',
];

const introWeeks = [
  'Week 0 - Pre-Class Information',
  'Week 1 - JavaScript Basics',
  'Week 2 - JavaScript Functions',
  'Week 3 - JavaScript Loops',
  'Week 4 - JavaScript Arrays',
  'Week 5 - JavaScript Objects',
  'Week 6 - Introduction to Git',
  'Week 7 - How the Web Works',
  'Week 8 - HTML Basics',
  'Week 9 - JavaScript and the DOM',
  'Week 10 - HTML Forms and DOM Practice',
  'Week 11 - CSS Basics',
  'Week 12 - CSS Layout',
  'Week 13 - How the Internet Works & Debugging',
  'Week 14 - AJAX Basics',
  'Week 15 - Working with the Fetch API',
  'Week 16 - Final Project',
];

const rubyWeeks = [
  'Week 0 - Pre-Class Information',
  'Week 1 - SQL basics',
  'Week 2 - More SQL, Introduction to Ruby',
  'Week 3 - Ruby Collections, Loops, and Conditional Statements',
  'Week 4 - Ruby Methods, Classes, and Blocks',
  'Week 5 - Ruby Test First Development',
  'Week 6 - Rails Basics',
  'Week 7 - Rails Active Record Associations',
  'Week 8 - Additional Rails Topics',
  'Week 9 - Rails Testing with RSpec',
  'Week 10 - Bringing it All Together',
  'Week 11 - Bootstrap 4 Basics; Bootstrap in Rails',
  'Week 12 - Building an API, Swagger',
  'Week 13 - Building an API, Swagger',
  'Week 14 - Calling the API Using Fetch',
  'Week 15 - Final Project Begins',
  'Week 16 - Final Project Continues',
  'Week 17 - Final Project Completed',
  'Week 18 - Final Project Presentations',
];

export function getCohortWeeks(name: CohortSubject) {
  switch (name) {
    case 'Node.js/Express':
      return nodeWeeks;
    case 'React.js':
      return reactWeeks;
    case 'Ruby on Rails':
      return rubyWeeks;
    case 'Intro to programming':
      return introWeeks;
  }
}
