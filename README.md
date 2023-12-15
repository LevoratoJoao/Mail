# Mail

This is a front-end app for an email client that makes API calls to send and receive emails.

# Installation 

To use this project first you need python and django

To install django
```bash
pip3 install Django
```

To run the project
```bash
python3 manage.py runserver
```

To make migrations for the mail app.
```bash
python3 manage.py makemigrations mail
```

To apply migrations to your database.
```bash
python manage.py migrate
```

# API

This application supports the following API routes

## ``GET /emails/<str:mailbox>``

Sending a GET request to /emails/<mailbox> where <mailbox> is either inbox, sent, or archive will return back to you (in JSON form) a list of all emails in that mailbox, in reverse chronological order. For example, if you send a GET request to /emails/inbox, you might get a JSON response like the below (representing two emails):
```json
[
    {
        "id": 100,
        "sender": "foo@example.com",
        "recipients": ["bar@example.com"],
        "subject": "Hello!",
        "body": "Hello, world!",
        "timestamp": "Jan 2 2020, 12:00 AM",
        "read": false,
        "archived": false
    },
    {
        "id": 95,
        "sender": "baz@example.com",
        "recipients": ["bar@example.com"],
        "subject": "Meeting Tomorrow",
        "body": "What time are we meeting?",
        "timestamp": "Jan 1 2020, 12:00 AM",
        "read": true,
        "archived": false
    }
]
```
Notice that each email specifies its id (a unique identifier), a sender email address, an array of recipients, a string for subject, body, and timestamp, as well as two boolean values indicating whether the email has been read and whether the email has been archived.

Note also that if you request an invalid mailbox (anything other than inbox, sent, or archive), you’ll instead get back the JSON response 
```json
{"error": "Invalid mailbox."}
```

## ``GET /emails/<int:email_id>``

Sending a GET request to /emails/email_id where email_id is an integer id for an email will return a JSON representation of the email, like the below:

```json
{
        "id": 100,
        "sender": "foo@example.com",
        "recipients": ["bar@example.com"],
        "subject": "Hello!",
        "body": "Hello, world!",
        "timestamp": "Jan 2 2020, 12:00 AM",
        "read": false,
        "archived": false
}
```

Note that if the email doesn’t exist, or if the user does not have access to the email, the route instead return a 404 Not Found error with a JSON response of 

```json
{"error": "Email not found."}
```

## ``POST /emails``
To send an email, you can send a POST request to the /emails route. The route requires three pieces of data to be submitted: a recipients value (a comma-separated string of all users to send an email to), a subject string, and a body string. 
If the email is sent successfully, the route will respond with a 201 status code and a JSON response of 

```json
{"message": "Email sent successfully."}
```



# Demo

Here it is a simple usage example on YouTube: [TODO]().

Open the web server in your browser, and use the “Register” link to register for a new account. The emails you’ll be sending and receiving in this project will be entirely stored in the database (they won’t actually be sent to real email servers), so you’re welcome to choose any email address ``(e.g. foo@example.com)`` and password you’d like
