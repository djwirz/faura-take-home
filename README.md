# Encore Petfinder API

This project is built using [Encore](https://encore.dev/) and integrates with the [Petfinder API](https://www.petfinder.com/developers/) to search for adoptable pets.

## Getting Started

### Prerequisites

- Install [Node.js](https://nodejs.org/) (LTS recommended)
- Install [Encore CLI](https://encore.dev/docs/install)
- Create a [Petfinder API key](https://www.petfinder.com/developers/)

### Installation

Clone the repository and install dependencies:

```
git clone https://github.com/encoredev/encore-petfinder-api.git
cd encore-petfinder-api
npm install
```

### Setup Environment Variables

Create a `.env.test` file and add the following:

```
PET_FINDER_API_KEY=your_api_key
PET_FINDER_SECRET=your_api_secret
```

### Running the Service

Start the Encore backend:

```
encore run
```

The API should now be available at `http://localhost:4000`.

### Running Tests

Run tests using Vitest via Encore:

```
encore test
```

## API Endpoints

| Method | Endpoint  | Description             |
| ------ | --------- | ----------------------- |
| GET    | `/pets`   | Retrieve a list of pets |
| POST   | `/search` | Search pets by criteria |
