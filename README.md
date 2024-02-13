
# Project Title

I create a Online Image Uploader Like a pintrest clone. User can add a image .also  updata and delete . 


## API Reference

#### Get all items

```http
  GET /api/images
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Get item

```http
  GET /api/items/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |




## Deployment

To deploy this project run

```bash
  npm run deploy
```


## Installation

Install my-project with npm

```bash
  npm install my-project
  cd my-project
```
    
## Features

- upload photo
- user credentials
- Fullscreen mode and responsive
- safety and secure


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file


`PORT` = 4000  

`DB_URI` = 

`JWT_SECRET` = 

`JWT_EXPIRE` = 

`COOKIE_EXPIRE` = 5

`SMTP_SERVICE` = gmail

`SMTP_MAIL` = 

`SMTP_PASSWORD` = 


`CLOUDINARY_NAME`  = 

`API_KEY`          =

`API_SECRET`       =  
## Tech Stack

**Client:** React, Redux, CSS

**Server:** Node, Express,mongodb

