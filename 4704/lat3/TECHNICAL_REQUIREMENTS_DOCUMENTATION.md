# Technical Requirements Implementation Documentation

## Overview
This document describes the implementation of advanced React patterns and state management techniques in the SISI LMS project to meet technical requirements.

## Table of Contents
1. [Error Boundary Implementation](#error-boundary)
2. [useReducer Pattern Implementation](#usereducer-pattern)
3. [Comprehensive Dummy Data](#dummy-data)
4. [Custom Hooks with Reducers](#custom-hooks)
5. [Usage Examples](#usage-examples)

---

## 1. Error Boundary Implementation {#error-boundary}

### Location
`src/Components/ErrorBoundary.jsx`

### Purpose
Provides a graceful error handling mechanism that catches JavaScript errors anywhere in the component tree, logs those errors, and displays a fallback UI instead of crashing the entire application.

### Features
- **Error Catching**: Implements `componentDidCatch` to catch errors in child components
- **Error State**: Uses `getDerivedStateFromError` to update state when error occurs
- **Fallback UI**: Beautiful error page with user-friendly messaging
- **Development Mode**: Shows detailed error information and stack trace in dev mode
- **Production Mode**: Hides technical details for better UX
- **Recovery Actions**:
  - Reload Page button (`window.location.reload()`)
  - Go to Dashboard button (navigation to `/admin/dashboard`)
- **Support Contact**: Email link to `support@sisi-lms.com`

### Implementation

```jsx
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // Here you could send error to logging service
    // Example: logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full">
            {/* Fallback UI */}
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Integration
The ErrorBoundary wraps the entire application in `App.jsx`:

```jsx
<StrictMode>
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* All routes */}
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
</StrictMode>
```

### Testing Error Boundary
To test the Error Boundary, create a component that throws an error:

```jsx
const TestErrorComponent = () => {
  const [shouldError, setShouldError] = useState(false);
  
  if (shouldError) {
    throw new Error("Test error for Error Boundary");
  }
  
  return (
    <button onClick={() => setShouldError(true)}>
      Throw Error
    </button>
  );
};
```

---

## 2. useReducer Pattern Implementation {#usereducer-pattern}

### Overview
Two comprehensive reducers have been implemented to manage complex state in Quiz Taking and Forum Discussion features.

### 2.1 Quiz Reducer

**Location**: `src/utils/reducers/quizReducer.js`

**Purpose**: Manage all state related to quiz taking, including navigation, answers, flags, timer, and submission.

**Initial State**:
```javascript
const initialQuizState = {
  quiz: null,
  currentQuestionIndex: 0,
  answers: {},
  flaggedQuestions: [],
  timeRemaining: 0,
  isSubmitting: false,
  showReview: false,
  isCompleted: false,
  startTime: null,
  endTime: null,
};
```

**Actions** (14 total):
1. `LOAD_QUIZ` - Load quiz data and initialize timer
2. `NEXT_QUESTION` - Navigate to next question
3. `PREV_QUESTION` - Navigate to previous question
4. `GOTO_QUESTION` - Jump to specific question by index
5. `ANSWER_QUESTION` - Save answer for a question
6. `FLAG_QUESTION` - Flag question for review
7. `UNFLAG_QUESTION` - Remove flag from question
8. `TICK_TIMER` - Decrement timer by 1 second
9. `SHOW_REVIEW` - Show review mode
10. `HIDE_REVIEW` - Hide review mode
11. `SUBMIT_QUIZ` - Start quiz submission
12. `COMPLETE_QUIZ` - Mark quiz as completed
13. `RESET_QUIZ` - Reset to initial state

**Special Features**:
- Auto-submit when timer reaches 0
- Immutable state updates
- Timer boundary protection (doesn't go below 0)
- Pure function - no side effects

**Example Usage**:
```javascript
const [state, dispatch] = useReducer(quizReducer, initialQuizState);

// Load quiz
dispatch({
  type: QUIZ_ACTIONS.LOAD_QUIZ,
  payload: { quiz: quizData }
});

// Answer question
dispatch({
  type: QUIZ_ACTIONS.ANSWER_QUESTION,
  payload: { questionId: 1, answer: "B" }
});

// Navigate
dispatch({ type: QUIZ_ACTIONS.NEXT_QUESTION });
```

### 2.2 Forum Reducer

**Location**: `src/utils/reducers/forumReducer.js`

**Purpose**: Manage complex forum thread state including nested replies, voting, editing, and moderation.

**Initial State**:
```javascript
const initialForumState = {
  thread: null,
  replies: [],
  replyText: "",
  replyingTo: null,
  editingReply: null,
  isSubmitting: false,
  isLoading: false,
  error: null,
  sortBy: "oldest",
  filterBy: "all",
};
```

**Actions** (20 total):
1. `LOAD_THREAD` - Start loading thread
2. `LOAD_THREAD_SUCCESS` - Thread loaded successfully
3. `LOAD_THREAD_ERROR` - Thread loading failed
4. `SET_REPLY_TEXT` - Update reply text input
5. `SET_REPLYING_TO` - Set comment being replied to
6. `CANCEL_REPLY` - Cancel reply mode
7. `START_EDIT_REPLY` - Start editing a reply
8. `CANCEL_EDIT_REPLY` - Cancel edit mode
9. `SUBMIT_REPLY` - Start reply submission
10. `SUBMIT_REPLY_SUCCESS` - Reply submitted successfully
11. `SUBMIT_REPLY_ERROR` - Reply submission failed
12. `UPDATE_REPLY` - Update existing reply
13. `DELETE_REPLY` - Delete a reply
14. `UPVOTE_REPLY` - Upvote a reply
15. `DOWNVOTE_REPLY` - Downvote a reply
16. `ACCEPT_ANSWER` - Mark reply as accepted answer
17. `PIN_THREAD` - Pin/unpin thread
18. `CLOSE_THREAD` - Close/open thread
19. `SET_SORT` - Change sort order
20. `SET_FILTER` - Change filter type
21. `RESET` - Reset to initial state

**Helper Functions**:
```javascript
// Sort replies by oldest/newest/popular
sortReplies(replies, sortBy)

// Filter replies by all/accepted/mine
filterReplies(replies, filterBy, currentUser)
```

**Special Features**:
- Nested reply support
- Optimistic UI updates for voting
- Immutable state updates
- Complex sorting and filtering logic
- Edit history tracking

---

## 3. Comprehensive Dummy Data {#dummy-data}

### Location
`src/utils/dummyData.js`

### Purpose
Centralized dummy data file providing realistic test data for development and testing.

### Data Structure

#### 3.1 Modules (12 modules - exceeds requirement of 10)

**Categories**: Web Development, JavaScript, React, Node.js, Database, Mobile Development, DevOps, UI/UX, Security, Testing, Algorithms, Python

**Fields**:
- `id`: Unique identifier
- `code`: Course code (e.g., "WEB101")
- `title`: Course title
- `description`: Detailed description
- `instructor`: Instructor name
- `duration`: Duration in weeks
- `level`: beginner/intermediate/advanced
- `topics`: Array of covered topics
- `enrolledStudents`: Number of enrolled students
- `rating`: Course rating (0-5)
- `status`: active/completed/upcoming
- `startDate`: Course start date
- `endDate`: Course end date

**Example**:
```javascript
{
  id: 1,
  code: "WEB101",
  title: "Web Development Fundamentals",
  description: "Learn the basics of web development including HTML, CSS, and JavaScript",
  instructor: "Dr. Ahmad Wijaya",
  duration: 8,
  level: "beginner",
  topics: ["HTML5", "CSS3", "JavaScript Basics", "Responsive Design"],
  enrolledStudents: 156,
  rating: 4.5,
  status: "active",
  startDate: "2024-01-15",
  endDate: "2024-03-15"
}
```

#### 3.2 Quizzes (33 quizzes - exceeds requirement of 30)

**Distribution**: Linked to all modules, covering all difficulty levels

**Fields**:
- `id`: Unique identifier
- `moduleId`: Reference to parent module
- `title`: Quiz title
- `description`: Quiz description
- `difficulty`: easy/medium/hard
- `duration`: Duration in minutes
- `passingScore`: Minimum score to pass
- `totalQuestions`: Number of questions
- `totalPoints`: Maximum points
- `attempts`: Number of attempts made
- `averageScore`: Average score across attempts
- `status`: available/locked/completed

**Example**:
```javascript
{
  id: 1,
  moduleId: 1,
  title: "HTML Basics Quiz",
  description: "Test your understanding of HTML fundamentals",
  difficulty: "easy",
  duration: 15,
  passingScore: 70,
  totalQuestions: 10,
  totalPoints: 100,
  attempts: 245,
  averageScore: 82,
  status: "available"
}
```

#### 3.3 Achievements (15 achievements - exceeds requirement of 10)

**Categories**: learning, mastery, consistency, special, community

**Rarity Levels**: common, rare, epic, legendary

**Fields**:
- `id`: Unique identifier
- `title`: Achievement title
- `description`: Achievement description
- `category`: Achievement category
- `icon`: Icon identifier
- `rarity`: common/rare/epic/legendary
- `points`: Points awarded
- `requirement`: Number/threshold required
- `unlockCriteria`: Detailed unlock criteria

**Example**:
```javascript
{
  id: 1,
  title: "First Steps",
  description: "Complete your first module",
  category: "learning",
  icon: "🎯",
  rarity: "common",
  points: 10,
  requirement: 1,
  unlockCriteria: "Complete 1 module"
}
```

### Import Usage

```javascript
// Named imports
import { modules, quizzes, achievements } from './utils/dummyData';

// Default import (object with all data)
import dummyData from './utils/dummyData';
const { modules, quizzes, achievements } = dummyData;
```

---

## 4. Custom Hooks with Reducers {#custom-hooks}

### 4.1 useQuizTaking Hook

**Location**: `src/utils/hooks/useQuizTaking.jsx`

**Purpose**: Encapsulate quiz-taking logic using useReducer pattern

**Features**:
- Automatic quiz loading
- Timer countdown with auto-submit
- Question navigation
- Answer management
- Flag/unflag questions
- Review mode
- Progress tracking

**Return Values**:
```javascript
const {
  // State
  quiz,
  currentQuestionIndex,
  answers,
  flaggedQuestions,
  timeRemaining,
  isSubmitting,
  showReview,
  isCompleted,
  
  // Actions
  goToNextQuestion,
  goToPrevQuestion,
  goToQuestion,
  answerQuestion,
  toggleFlag,
  showReview,
  hideReview,
  handleSubmitQuiz,
  resetQuiz,
  
  // Helpers
  getCurrentQuestion,
  getAnsweredCount,
  getUnansweredCount,
  isQuestionAnswered,
  isQuestionFlagged,
  formatTime,
  getProgress,
} = useQuizTaking(quiz);
```

**Usage Example**:
```jsx
function QuizTaking() {
  const {
    quiz,
    currentQuestionIndex,
    answers,
    timeRemaining,
    goToNextQuestion,
    answerQuestion,
    formatTime,
  } = useQuizTaking(quizData);

  return (
    <div>
      <div>Time: {formatTime(timeRemaining)}</div>
      <QuestionDisplay 
        question={quiz?.questions[currentQuestionIndex]}
        onAnswer={(answer) => answerQuestion(question.id, answer)}
      />
      <button onClick={goToNextQuestion}>Next</button>
    </div>
  );
}
```

### 4.2 useForumThread Hook

**Location**: `src/utils/hooks/useForumThread.jsx`

**Purpose**: Encapsulate forum thread logic using useReducer pattern

**Features**:
- Thread and replies loading
- Nested reply management
- Reply submission
- Edit/delete functionality
- Voting system (upvote/downvote)
- Accept answer
- Thread moderation (pin/close)
- Sorting (oldest/newest/popular)
- Filtering (all/accepted/mine)

**Return Values**:
```javascript
const {
  // State
  thread,
  replies,
  replyText,
  replyingTo,
  editingReply,
  isSubmitting,
  isLoading,
  error,
  sortBy,
  filterBy,
  
  // Actions
  loadThread,
  setReplyText,
  startReplyTo,
  cancelReply,
  submitReply,
  updateReply,
  deleteReply,
  upvoteReply,
  downvoteReply,
  acceptAnswer,
  setSortBy,
  setFilterBy,
  
  // Helpers
  getSortedAndFilteredReplies,
  getNestedReplies,
  getTotalReplyCount,
  getReplyCount,
} = useForumThread(threadId, currentUser);
```

**Usage Example**:
```jsx
function ForumThread({ threadId }) {
  const { user } = useAuth();
  const {
    thread,
    replies,
    replyText,
    setReplyText,
    submitReply,
    upvoteReply,
    getNestedReplies,
  } = useForumThread(threadId, user);

  const handleSubmit = async () => {
    await submitReply(replyText);
    setReplyText("");
  };

  return (
    <div>
      <h1>{thread?.title}</h1>
      <div>
        {getNestedReplies().map(reply => (
          <Reply 
            key={reply.id} 
            reply={reply}
            onUpvote={() => upvoteReply(reply.id)}
          />
        ))}
      </div>
      <textarea 
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
```

---

## 5. Usage Examples {#usage-examples}

### Example 1: Using Quiz Reducer in Component

```jsx
import { useQuizTaking } from '../utils/hooks/useQuizTaking';
import { quizzes } from '../utils/dummyData';

function QuizPage() {
  const quiz = quizzes[0]; // Get first quiz from dummy data
  
  const {
    currentQuestionIndex,
    answers,
    timeRemaining,
    flaggedQuestions,
    goToNextQuestion,
    goToPrevQuestion,
    answerQuestion,
    toggleFlag,
    handleSubmitQuiz,
    getCurrentQuestion,
    getProgress,
    formatTime,
  } = useQuizTaking(quiz);

  const currentQuestion = getCurrentQuestion();
  const progress = getProgress();

  return (
    <div className="quiz-container">
      {/* Header */}
      <div className="quiz-header">
        <h1>{quiz.title}</h1>
        <div className="timer">
          Time Left: {formatTime(timeRemaining)}
        </div>
        <div className="progress">
          Progress: {progress}%
        </div>
      </div>

      {/* Question */}
      <div className="question-section">
        <h2>Question {currentQuestionIndex + 1}</h2>
        <p>{currentQuestion?.text}</p>
        
        {currentQuestion?.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => answerQuestion(currentQuestion.id, option)}
            className={answers[currentQuestion.id] === option ? 'selected' : ''}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="navigation">
        <button onClick={goToPrevQuestion}>Previous</button>
        <button 
          onClick={() => toggleFlag(currentQuestion.id)}
          className={flaggedQuestions.includes(currentQuestion.id) ? 'flagged' : ''}
        >
          {flaggedQuestions.includes(currentQuestion.id) ? 'Unflag' : 'Flag'}
        </button>
        <button onClick={goToNextQuestion}>Next</button>
      </div>

      {/* Submit */}
      <button onClick={handleSubmitQuiz} className="submit-btn">
        Submit Quiz
      </button>
    </div>
  );
}
```

### Example 2: Using Forum Reducer in Component

```jsx
import { useForumThread } from '../utils/hooks/useForumThread';
import { useAuth } from '../utils/contexts/AuthContext';

function ForumThreadPage({ threadId }) {
  const { user } = useAuth();
  const {
    thread,
    replyText,
    replyingTo,
    sortBy,
    filterBy,
    isSubmitting,
    setReplyText,
    startReplyTo,
    cancelReply,
    submitReply,
    upvoteReply,
    downvoteReply,
    setSortBy,
    setFilterBy,
    getNestedReplies,
  } = useForumThread(threadId, user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (replyText.trim()) {
      await submitReply(replyText);
    }
  };

  const nestedReplies = getNestedReplies();

  return (
    <div className="forum-thread">
      {/* Thread Header */}
      <div className="thread-header">
        <h1>{thread?.title}</h1>
        <p>{thread?.content}</p>
      </div>

      {/* Controls */}
      <div className="controls">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="oldest">Oldest First</option>
          <option value="newest">Newest First</option>
          <option value="popular">Most Popular</option>
        </select>

        <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
          <option value="all">All Replies</option>
          <option value="accepted">Accepted Answers</option>
          <option value="mine">My Replies</option>
        </select>
      </div>

      {/* Replies */}
      <div className="replies">
        {nestedReplies.map(reply => (
          <ReplyComponent
            key={reply.id}
            reply={reply}
            onReply={() => startReplyTo(reply)}
            onUpvote={() => upvoteReply(reply.id)}
            onDownvote={() => downvoteReply(reply.id)}
          />
        ))}
      </div>

      {/* Reply Form */}
      <form onSubmit={handleSubmit}>
        {replyingTo && (
          <div className="replying-to">
            Replying to {replyingTo.author.name}
            <button type="button" onClick={cancelReply}>Cancel</button>
          </div>
        )}
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Write your reply..."
          disabled={isSubmitting}
        />
        <button type="submit" disabled={isSubmitting || !replyText.trim()}>
          {isSubmitting ? 'Submitting...' : 'Submit Reply'}
        </button>
      </form>
    </div>
  );
}
```

### Example 3: Testing Error Boundary

```jsx
// Create a component that throws error for testing
function ErrorTestComponent() {
  const [shouldError, setShouldError] = useState(false);
  
  if (shouldError) {
    throw new Error("This is a test error to verify Error Boundary");
  }
  
  return (
    <div>
      <h2>Error Boundary Test</h2>
      <p>Click the button below to trigger an error:</p>
      <button 
        onClick={() => setShouldError(true)}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Throw Error
      </button>
    </div>
  );
}

// Use in a route
<Route path="/test-error" element={<ErrorTestComponent />} />
```

---

## Summary of Technical Requirements

### ✅ All Requirements Met

1. **React Query**: 
   - Implemented in `useAnalytics`, `useChart`, and other custom hooks
   - Used for server state management

2. **Context API**: 
   - `AuthContext` for global authentication state
   - Wraps entire application

3. **useReducer Pattern**: 
   - `quizReducer` for Quiz Taking (14 actions)
   - `forumReducer` for Forum Discussions (20 actions)
   - Encapsulated in custom hooks

4. **Error Boundaries**: 
   - `ErrorBoundary` component with fallback UI
   - Integrated in `App.jsx`
   - Development and production modes

5. **Comprehensive Dummy Data**: 
   - ✅ 12 modules (exceeds 10 minimum)
   - ✅ 33 quizzes (exceeds 30 minimum)
   - ✅ 15 achievements (exceeds 10 minimum)

6. **Custom Hooks**: 
   - `useQuizTaking` - Quiz management with reducer
   - `useForumThread` - Forum management with reducer
   - Plus 5 existing hooks (useAnalytics, useChart, UseKelas, UseMahasiswa, UseMataKuliah)

---

## File Structure

```
src/
├── Components/
│   └── ErrorBoundary.jsx          # Error boundary component
├── utils/
│   ├── dummyData.js               # Comprehensive dummy data
│   ├── reducers/
│   │   ├── quizReducer.js         # Quiz state reducer
│   │   └── forumReducer.js        # Forum state reducer
│   ├── hooks/
│   │   ├── useQuizTaking.jsx      # Quiz taking custom hook
│   │   ├── useForumThread.jsx     # Forum thread custom hook
│   │   ├── useAnalytics.jsx       # Analytics hook with React Query
│   │   ├── useChart.jsx           # Chart hook with React Query
│   │   ├── UseKelas.jsx           # Class management hook
│   │   ├── UseMahasiswa.jsx       # Student management hook
│   │   └── UseMataKuliah.jsx      # Course management hook
│   └── contexts/
│       └── AuthContext.jsx        # Authentication context
└── App.jsx                        # App with ErrorBoundary wrapper
```

---

## Best Practices Implemented

1. **Separation of Concerns**: State logic separated into reducers
2. **Reusability**: Custom hooks encapsulate complex logic
3. **Immutability**: All reducers use immutable state updates
4. **Type Safety**: Action types defined as constants
5. **Error Handling**: Comprehensive error boundary with logging
6. **Performance**: useCallback/useMemo in custom hooks
7. **Testing**: Dummy data enables easy testing
8. **Documentation**: Extensive code comments
9. **Scalability**: Easy to add new actions and state

---

## Next Steps

1. **Refactor Existing Pages**:
   - Update `QuizTaking.jsx` to use `useQuizTaking` hook
   - Update `ForumThread.jsx` to use `useForumThread` hook

2. **Testing**:
   - Write unit tests for reducers
   - Test Error Boundary with error cases
   - Integration tests for custom hooks

3. **Enhancement**:
   - Add error logging service integration
   - Implement undo/redo functionality using reducers
   - Add middleware for reducer logging in development

4. **Documentation**:
   - Create API documentation for custom hooks
   - Add Storybook for component documentation

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Maintained By**: Development Team
