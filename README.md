# Prerequisites

Install docker and docker-compose.

# Running the API & info

The API can be run in development mode by executing *docker-compose build* and *docker-compose up*, tests can be run by executing *npm test* in a running container (note that this will interrupt database connection of main process).

**After running *docker-compose up*** MySQL may not be ready for a connection and therefore you will need to restart the process in *app* container. Simply saving a file in *src* directory should work, otherwise run *docker-compose restart app*.

API exposes port **8080**.

Needed changes if this should be a production project are listed in file **inproduction.txt**.

# Routes documentation

All the routes send *Content-Type: application/json* header. Potential error messages are sent in the following format:  
`{ errors: { message: string; field?: string; }[] }`

- **/auth**
    - **POST /auth**  
        *Creates new user*
        1. Expects:
            - nick: non-empty string
            - password: string of at least 5 characters
        2. Sends:
            - 400 on invalid data
            - 409 on nick collision
            - 201 on successful user creation
    - **POST /auth/login**  
        *Sends JWT expiring in 2h*
        1. Expects:
            - nick: non-empty string
            - password: string of at least 5 characters
        2. Sends:
            - 400 on invalid data
            - 401 on invalid credentials
            - 200 and { jwt: *your_jwt* } on successful login
- **/coll**  
    All /coll routes expect a JWT sent as a *token* property on body. If the JWT is invalid or expired, expect 401.
    - **POST /coll**  
        *Creates new collection*
        1. Expects:
            - name: non-empty string
        2. Sends:
            - 400 on invalid data
            - 409 on collection name collision
            - 201 on successful collection creation
    - **GET /coll/<collection_name>**  
        *Sends a collection and its contents*
        1. Sends:
            - 404 on non-existent collection
            - 200 and collection object `{ name: string; stories: { ...storyprops; kids: { kid info with nested kids }[] }[] }`
    - **DELETE /coll/<collection_name>**  
        *Deletes a collection*
        1. Sends:
            - 404 on non-existent collection
            - 200 on successful deletion
    - **POST /coll/<collection_name>/<story_id>**  
        *Adds new HackerNews story into a collection*
        1. Sends:
            - 400 on invalid data
            - 404 on non-existent collection
            - 404 on non-existent story
            - 422 on unprocessable item type
            - 201 on successful addition
    - **DELETE /coll/<collection_name>/<story_id: number>**  
        *Removes a story from collection*
        1. Sends:
            - 400 on invalid data
            - 404 on non-existent collection
            - 404 on non-existent story
            - 200 on successful deletion
- **/search**
    *Sends search results*
    1. Expects:
        - q as query parameter: string
    2. Sends:
        - 400 on invalid data
        - 200 and array of elasticsearch records on successful search