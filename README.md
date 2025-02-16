# Chaitanya's Cactro Polls Fullstack App

## Description

This is a fullstack web application that allows users to create, vote, and view polls. We are using Next.js App Router for both the frontend and backend. The database is a PostgreSQL database. The frontend is styled using Tailwind CSS.

## API Endpoints

### Create Poll

- **Endpoint**: `POST /api/polls/create`
- **Description**: Creates a new poll with a question and multiple options
- **Request Body**:

```typescript
{
  question: string;
  options: string[];  // Array of option texts
}
```

- **Response** (201):

```typescript
{
  poll: {
    id: string;
    question: string;
    options: Array<{
      id: string;
      text: string;
      votes: number;
    }>;
  }
}
```

### Get Poll Results

- **Endpoint**: `GET /api/polls/{id}`
- **Description**: Retrieves a poll and its current voting results including percentages
- **Parameters**: `id` - The unique identifier of the poll
- **Response**:

```typescript
{
  id: string;
  question: string;
  totalVotes: number;
  options: Array<{
    id: string;
    text: string;
    votes: number;
    percentage: number; // Percentage of total votes (rounded to nearest integer)
  }>;
}
```

### Vote on a Poll

- **Endpoint**: `POST /api/polls/vote`
- **Description**: Records a vote for a specific option in a poll
- **Request Body**:

```typescript
{
  optionId: string; // ID of the option being voted for
}
```

- **Response**:

```typescript
{
  id: string;
  text: string;
  votes: number;
}
```

### Error Responses

All endpoints may return the following errors:

- `400 Bad Request`: Invalid request data or invalid option
- `404 Not Found`: Poll not found
- `500 Internal Server Error`: Server-side error

Example error response format:
```typescript
{
  error: string; // Error message describing what went wrong
}
