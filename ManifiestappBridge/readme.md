# MANIFIESTAPPBRIDGE

In the ManifiestApp, we need to show the shifts of the volunteers

Actually we use Beeple to manage that, Beeple have an API, but with some problem



## ENV

### FLASK_ENV


### BEEPLE_URL

The url of the company beeple instance

https://<url>/api/v1/


### BEEPLE_TOKEN

A admin token, because the current user token dont work


### EXCEL_URL

The internet path to the excel file to match the connected user to the right id



## Bridge API Error key-message

### auth-bad-body

The body of the post must be {session: {email,password,display}}


### auth-bad-authentification

You are not (yet) a volunteer


### auth-bad-combination

Wrong mail or password ?


### auth-bad-not-in-file

You are on the volunteer db but not yet in the volunteer excel, it will come as soon as possible


### enrolments-get-fail

There is a problem to fetch your shifts


### cors-bridge-fail

There is a problem with the bridge to get the route

### schedule-update-fail

There is a problem to see if there is any update of the event schedule




## Beeple Problems

### List of ID

All route of shifts need the id of the volunteer, logic

But when the user (volunteer) connect, the response do not send the id of the user (nice...)

So we take the last excel export of the Beeple volunteers, with Beeple code and email of all user and match that to have in return the id


### Beeple Code vs ID in the Excel

The Beeple Code is always 1100 up than the real id of a volunteer

Why ? We don't know but we need to manage with that ...

So when we want to receive the ID from the excel, we need to do (beeple code - 1100) to have the real ID


### TOKEN

We cannot use the token from the user authentification to call the other API route

We need an admin's token for that

TODO maybe later, always get the token from an admin connection | For the moment we have an admin token in env file
