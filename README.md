# BILLYBILLY

this app is created in request of my friend Edward MOK who wanted to have a video streaming platform yet allowing audience to scan QR code and leave carousel message on screen

# objective

To create a server allow video management and allow user to send text message

# Getting started

## prerequsite

### software

- node v18+
- git
- pnpm

### knowledge

- git basic usage
- node cli
- pnpm cli

## steps

1. clone this repo
2. run `pnpm install`
3. run `node server.js`

# specification

this project is only focus on mvp and efficiency without any following any design pattern and specific framework it just uses bare minimum nodejs with express server for backend and uses handlebar for frontend to minimize building and bundling process yet provide a effective website

## communication protocol

- socket.io
- http

## file storage

- local file system

## limitation

- this repo does not contain any devops thing, will require architecture for devops and automation. the easiest way would be an AMAZON EC2 linux instance
- lack of security implementation, there is no cipher as well as password protection to any of the route
- all the limitation of node express server
