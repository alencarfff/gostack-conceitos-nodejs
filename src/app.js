
const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();
app.use(express.json());
app.use(cors());

const repositories = [];

const repositoryExists = (request, response, next) => {
  const { id } = request.params;
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if( repositoryIndex === -1 ) 
    return response.status(400).json({ message: 'Bad Request'});
  
  request.repositoryIndex = repositoryIndex;
  
  return next();
}

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const newRepository = { 
    id: uuid(), 
    title, 
    url, 
    techs, 
    likes: 0 
  };
  
  repositories.push(newRepository);

  return response.status(201).json(newRepository);
});

app.delete("/repositories/:id", repositoryExists, (request, response) => {
  const { repositoryIndex } = request;

  repositories.splice(repositoryIndex, 1);

  return response.status(204).json();
});

app.post("/repositories/:id/like", repositoryExists, (request, response) => {
  const { repositoryIndex } = request;
  var { likes } = repositories[repositoryIndex];
  
  likes += 1;

  repositories[request.repositoryIndex].likes = likes;

  return response.status(201).json({ likes });
});

app.put("/repositories/:id", repositoryExists, (request, response) => {
  const { title, url, techs } = request.body, 
        { repositoryIndex } = request,
        { id } = request.params;

  const { likes } = repositories[repositoryIndex];

  const updatedRepository = { id, title, url, techs, likes };
  repositories[repositoryIndex] = updatedRepository;

  return response.status(200).json(updatedRepository);
});

module.exports = app;
