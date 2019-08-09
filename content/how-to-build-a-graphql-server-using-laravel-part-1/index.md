---
title: "How to build a GraphQL Server using Laravel - Part 1"
description: "In the past, generating a Cron entry required each task to be scheduled on your server. Laravel’s task scheduling feature gives you the…"
date: "2019-08-06T16:54:58.194Z"
categories: [
  laravel
]
published: true
---

![](./asset-1.png)

---

Stepping into modern API development and infrastructure can be tough with so many acronyms such as `SOAP, REST & GraphQL` running around. API's have evolved and continue to evolve, of course. In this series, we are going to look at how to build our own GraphQL server using Laravel. To make the series very easy to follow, i have divided it into 3 articles/parts.

* [Part 1: What is GraphQL and it's advantages? GraphQl vs REST](/#)
* [Part 2: Setup our laravel Project](/#)
* [Part 3: Setup our GraphQL Server & Playground in our project](/#)

## Why GraphQl?
 If you are afraid or think the word `GraphQl` sounds complicated and difficult, it isn't anymore. GraphQL is cool! It isn't just the new kid on the block everyone is talking about, it's worth the hype. GraphQL is extremely handy when used to serve as an endpoint for different frontends such as mobile apps and single-page applications. You can create a GraphQL API in any programming language plus it's easy to setup in most major frameworks out there today.
  
Most of us have been creating and using REST APIs for a long time now so one may ask, what’s with all the excitement, how is GraphQL even different than rest?

> In case you’re still not familiar with it,  GraphQL is a data fetching specification that also functions as an API query language. It was created by Facebook back in 2012 to support their mobile application infrastructure and then open sourced in 2015.  — graphql.org

Though REST is an `architecture` and GraphQL is a `specification`, both tools are used to build and interact with APIs. 
GraphQL clients control the data they get, not the server, making it easier for APIs to evolve over time. While typical REST APIs require loading from multiple URLs or endpoints, GraphQL APIs get all the data your app needs in a single request to a single endpoint. With GraphQL the goal is to create a `/graphql` endpoint without removing the REST endpoints. The GraphQL endpoint will hit the database ORM directly to fetch data, so that it is totally independant from the REST logic.

## Graphql vs. REST: Why is GraphQL better?
1. REST requests often lead to over or under retrieval of information because endpoints return fixed data structures. Say you have a user resource on the back-end with first name, last name, email, and 10 other fields. On the client, you only need first name, last name, email. Making a REST call on the /users endpoint gives you back all the fields of the user, and the client only uses the ones it needs. There is clearly some data transfer waste, which might be a consideration on mobile clients. A similar query for GraphQL will be ;
    ``` 
    query {
      user {
        firstname
        lastname
        email
      }
    }
    ``` 

2. let's also consider an application with three resources: users, projects, and tasks with their relationships. Things get trickier when we want to show only the projects’ titles on the home page, but all projects and their related tasks on the dashboard, without making multiple REST calls. One request is enough to get both our resource as well as related resources. It’s common practice to add query parameters such as `?include=tasks` on the projects endpoint to make this work, and is even recommended by the JSON API specification. Query parameters like `?include=tasks` are still readable, you will agree we will sooon end up with something like `?include=tasks,tasks.owner,tasks.comments,tasks.comments.author`. Data fetching is often called out as the biggest improvement of GraphQL over REST. A similar query for GraphQL will be;
    ``` 
    query {
      user(id: 1) {
        projects {
          name
          tasks {
            description
          }
        }
      }
    }
    ``` 
3. When designing APIs we always start by trying to make the API as widely usable by all clients as possible, yet clients always want to make less API calls and get more data. ith REST, there are a couple of solutions. We can create a custom endpoint for a category of clients. Since GraphQL gives more power to the client, a client that needs complex request will build the corresponding queries itself. Therefore, each client can consume the same API differently.

4. When working with REST APIs, we see frequent versioning — sometimes the field you are trying to fetch only exists in GenericAPI v2, and was deprecated in v3. Versioning makes the code on both sides of an API less maintainable. GraphQL APIs are able to be modified with new fields or types with no impact to existing queries. Fields can even be marked deprecated to exclude them from server responses.

5. After designing a REST API, you will need to document the endpoints with it's parameters and method of request. With GraphQL there's no need, as it's self documenting.

## Who’s uses GraphQL?
- Facebook 
- GitHub
- Pinterest
- Intuit
- Shopify etc

## SOAP, REST, Graphql : Which one should i choose?
No API format is a silver bullet, they all have their strengths and weaknesses. Deciding on the one to use, as always, depends on the need. When considering what protocol is right for you, consider what clients you will be supporting and how flexible you need to be.
- For SOAP, it's use in certain situations, but is largely overshadowed as the veteran of the industry.
- REST remains the go-to technology for most public APIs becuase it's more popular and most developers are used to it
- GraphQL aside being the new kid on the block, it has solved a lot of REST’s problems, and boasts a ton of other interesting features.

In this part of the series, we got to know GraphQL is, it's advantages and compared it to REST.  **Note, it's possible to try GraphQL without throwing away your REST infrastructure.** Want to know more about GraphQL? Visit the [official documentation](https://graphql.org/) for more information. In the next part of this series, we will look at how to setup a mini Laravel blog after which we will develop GraphQL APIs for. Feel free to hit me up with your views, comments or questions.



