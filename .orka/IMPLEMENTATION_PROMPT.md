# Task
Add a hello route

# Files to Modify
- core/orchestrator/index.ts

# Implementation Plan
1. Import the necessary modules for routing (e.g., express).
2. Create a new route handler for the path '/hello' that responds with a greeting message.
3. Ensure the route is added to the existing router in the index.ts file.
4. Test the route locally to confirm it returns the expected response.

# Edge Cases
- Ensure the route handles requests with different HTTP methods (e.g., GET, POST).
- Verify the response when the route is accessed with invalid parameters.

# Tests
- Test that a GET request to '/hello' returns a 200 status code and the correct greeting message.
- Test that a POST request to '/hello' returns a 405 Method Not Allowed status code.