# MANIFIESTAPPBRIDGE

In the ManifiestApp, we need to show the shifts of the volunteers

Actually we use Beeple to manage that, Beeple have an API, but with some problem


## List of ID

All route of shifts need the id of the volunteer, logic

But when the user (volunteer) connect, the response do not send the id of the user (nice...)

So we take the last excel export of the Beeple volunteers, with Beeple code and email of all user and match that to have in return the id


## Beeple Code vs ID in the Excel

The Beeple Code is always 1100 up than the real id of a volunteer

Why ? We don't know but we need to manage with that ...

So when we want to receive the ID from the excel, we need to do (beeple code - 1100) to have the real ID


## TOKEN

We cannot use the token from the user authentification to call the other API route

We need an admin's token for that

TODO maybe later, always get the token from an admin connection | For the moment we have an admin token in env file
