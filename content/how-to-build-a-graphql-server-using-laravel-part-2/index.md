---
title: "How to build a GraphQL Server using Laravel - Part 2"
description: "In this part of the series, we would setup a Laravel project, on top of which our GraphQL server…"
date: "2019-08-14T16:54:58.194Z"
categories: [
  laravel, GraphQL, APIs
]
published: true
---

![](./asset-1.png)

---

In the [first part](/how-to-build-a-graphql-server-using-laravel-part-1) of this series, we looked at what GraphQL is, it's advantages and even compared it with REST and SOAP. In this part of the series, we would setup a Laravel project, on top of which our GraphQL server would sit. 

As mentioned in the previous article, this series is divided into 3 parts:
* [Part 1: What is GraphQL and it's advantages? GraphQl vs REST](/how-to-build-a-graphql-server-using-laravel-part-1)
* [Part 2: Setup our Laravel Project](/how-to-build-a-graphql-server-using-laravel-part-2)
* [Part 3: Setup our GraphQL Server & Playground in our project](/#)

## What we’ll be building
In this project we’ll be building an API for a micro blog with which `users` can write `articles`. Furthermore, we would restrict certain features or functionality to only authenticated users.

## Prerequisites
To follow through this article, you’ll need the following:
* [**PHP**](https://www.php.net/) installed on your machine
* [**MYSQL**](https://www.mysql.com/) installed on your machine
* [**Composer**](https://getcomposer.org/) installed on your machine

## Creating the Project
To begin, let's create a new Laravel project via Composer with the command below:

```
composer create-project --prefer-dist laravel/laravel laravel-graphql-blog

```

> The command above tells Composer to create a Laravel project named `laravel-graphql-blog`.

The result is a new directory called `laravel-graphql-blog` inside the folder we ran the `composer create` command. Don't worry if you are new to Laravel's structure. You will learn the role of the most important directories and files as we build or you can head over to the [official documentation here](https://laravel.com/docs/5.8/structure).

Just to make sure we have everything working, run the commands below in your terminal to boot up our server:
``` bash
cd laravel-graphql
php artisan serve

```
> To make sure everything runs well, open `http://localhost:8000` in your browser and you should see Laravel’s default page.

## Setting up our Database
Now, open the `.env` file (which resides in the project's root) and configure the database parameters shown below accordingly to your development environment:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=homestead
DB_USERNAME=homestead
DB_PASSWORD=secret
```
> Note: The above assumes you have already created a MySQL database for this project.

## Creating our Models and Migrations
Laravel by default ships with a user model and it's migration file. We would want to include an `api_token` column to our User migration file for our api authentication therefore, let’s edit out this migration file located at `database/migrations/2014_10_12_000000_create_users_table.php`:
```php
// database/migrations/2014_10_12_000000_create_users_table.php

<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('api_token', 80)->unique()->nullable()->default(null);
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
```

Voila! Now, let’s create an Article model and its corresponding migration file. To do that, run the command below:

```bash
php artisan make:model Article -m
```
> The command above after creating the Article model, thanks to the **-m flag**, would create it's associated migration script. 
>
> A [migration](https://laravel.com/docs/5.8/migrations) script defines the table structure needed to persist data in a database. 

The `Article` model is implemented in the `Article.php` file that you will find inside the `app` directory. In fact, the `app` directory contains the code representing the application's domain. 

Once that’s done, open the migration file that was generated and update it's **up method** as below:
```php
// database/migrations/2019_08_08_000000_create_articles_table.php

/**
* Run the migrations.
*
* @return void
*/
public function up()
{
    Schema::create('articles', function (Blueprint $table) {
        $table->bigIncrements('id');
        $table->unsignedBigInteger('user_id');
        $table->string('title');
        $table->text('content');
        $table->timestamps();

        // User ID foreign Key
        $table->foreign('user_id')->references('id')->on('users');
    });
}
```
> In the above migration file, we added a `foreign key` pointing to the `id` on our `users table` as well as the `title` and `content` columns. 
>
> **Note:** The up method is used to add new tables, columns, or indexes to your database, while the down method should reverse the operations performed by the up method.

Now, let’s run the migration by executing the command below:
```
php artisan migrate
```
## Define relationships between models
Next, let’s define the relationships between our models. Take note, we’ll be defining only the necessary parts of the relationships needed for the purpose of this tutorial. 

To do so, let's update our models by defining the necessary relationships starting with our User Model:
```php
// app/User.php

<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function articles()
    {
        return $this->hasMany(Article::class);
    }
}
```
> The relationship between a `User` and an `Article`, will be a one-to-many relationship. That is, a user can write as many articles as they wish but  
> an article can only belong to one user.

Let’s define the inverse of the relationship on the Article model:
```php
// app/Article.php

<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id', 'title', 'content'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
```
> One may ask, how is the `Article` model defined in `app/Article.php` linked to the `articles table` in our database. This happens because, by convention, [Eloquent](https://laravel.com/docs/5.8/eloquent) maps a model to a table having the same lowercase name in the plural.

## Setting Database seeders
To test the API we are about to create, we need to have some data to work with. To do this, let’s create a database seeder to populate the tasks table with some data. 
We’ll start by creating some seeder classes for our `users` table. To do that, let's run the command below:
```bash
php artisan make:seeder UsersTableSeeder 

```
> [Seeders](https://laravel.com/docs/5.8/seeding) are classes that populate database tables with some data. 

The command above will generate a new file called `UsersTableSeeder.php` file in the `database/seeds` directory. Now let's update it with with the following:
```php
<?php

use App\User;
use App\Article;
use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = \Faker\Factory::create();
        User::create([
            'name' => $faker->name,
            'email' => 'me@mygraphqlapp.com',
            'password' => bcrypt('secret')
        ]);

        factory(User::class, 50)->create()->each(function($user) use ($faker){
            for ($i=0; $i < 5; $i++) {
                Article::create([
                    'user_id' => $user->id,
                    'title' => $faker->sentence,
                    'content' => $faker->paragraphs(3,true),
                ]);
            }
        });
    }
}
```
> In the above code, our `UsersTableSeeder` would first create a `User` with a random name but with an email of `me@mygraphqlapp.com` and password of `secret`. 
>
> Furthermore, using our default `User` [factories](https://laravel.com/docs/5.8/seeding#using-model-factories) which is located in the `database/factories` directory, we create `50 dummy Users` and for each one of these 50 users, we create `5 dummy articles` under them.

Finally, let’s go ahead and run our database seeders to get some data into our database:

```bash
php artisan db:seed
```

## Conclusion
In this article, we learn't how to setup a Laravel projected and created a micro blog. We've only setup up our Laravel project and in the next series, we would be building out our GraphQL API. Feel free to hit me up with your views, comments or questions. Stay tuned!