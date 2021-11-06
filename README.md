# Prerequisites

Install docker and docker-compose.

# Running the API & info

The API can be run in development mode by executing *docker-compose -p dev -f docker-compose.yml up*, tests can be run simultaneously with *docker-compose -p test -f docker-compose.test.yml up*.

**After running *docker-compose up*** MySQL may not be ready for a connection and therefore you will need to restart the process in *app* container. Simply saving a file in *src* directory should work, otherwise run *docker-compose restart app*.

API exposes port **8080**.

Needed changes if this should be a production project are listed in file **inproduction.txt**.

*Little note*: For testing purposes, I liked to use these stories: 123 & 28975856. Just so you don't have to look other ids up :)

# Routes documentation

All the routes send *Content-Type: application/json* header. Potential error messages are sent in the following format:  
`{ errors: { message: string; field?: string; }[] }`

- **/auth**
    - **POST /auth**  
        *Creates new user*
        1. Expects:
            - nick: non-empty string of at most 20 characters
            - password: string of at least 5 characters
        2. Sends:
            - 400 on invalid data
            - 409 on nick collision
            - 201 on successful user creation
    - **POST /auth/login**  
        *Sends JWT expiring in 2h*
        1. Expects:
            - nick: non-empty string of at most 20 characters
            - password: string of at least 5 characters
        2. Sends:
            - 400 on invalid data
            - 401 on invalid credentials
            - 200 and { jwt: *your_jwt* } on successful login
- **/collection**  
    All /collection routes expect a JWT sent as a *token* property on body. If the JWT is invalid or expired, expect 401.
    - **POST /collection**  
        *Creates new collection*
        1. Expects:
            - name: non-empty string of at most 20 characters
        2. Sends:
            - 400 on invalid data
            - 409 on collection name collision
            - 201 on successful collection creation
    - **GET /collection/<collection_name>**  
        *Sends a collection and its contents*
        1. Sends:
            - 404 on non-existent collection
            - 200 and collection object `{ name: string; stories: { ...storyprops; kids: { kid info with nested kids }[] }[] }`
    - **DELETE /collection/<collection_name>**  
        *Deletes a collection*
        1. Sends:
            - 404 on non-existent collection
            - 200 on successful deletion
    - **POST /collection/<collection_name>/<story_id>**  
        *Adds new HackerNews story into a collection*
        1. Sends:
            - 400 on invalid data
            - 404 on non-existent collection
            - 404 on non-existent story
            - 422 on unprocessable item type
            - 201 on successful addition
    - **DELETE /collection/<collection_name>/<story_id: number>**  
        *Removes a story from collection*
        1. Sends:
            - 400 on invalid data
            - 404 on non-existent collection
            - 404 on non-existent story
            - 200 on successful deletion
- **/search?q=<your_query>**  
    *Sends search results*
    1. Sends:
        - 400 on invalid data
        - 200 and array of elasticsearch records on successful search