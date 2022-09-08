# text-to-chart

demo using d3, react and [openai GPT-3 api](https://beta.openai.com/docs/models/gpt-3)

## usage

entering a movie genre, and the form will query openai to generate a completion. the completion is then parsed and fed into a d3 bar-chart to display title, year and metascore of top movies from that genre.

## installation

- clone this repository

- `npm install`

- get an api key from [openai](https://beta.openai.com/overview) and add it to a file called `.env.local` as `OPENAI_API_KEY=...`

OR

- uncomment the dummy and comment out the openai query in `pages/index.jsx`:

```
// COMMENT OUT this
const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        query: `
            A three-column spreadsheet of top ${genre} movies and the year of release and the metascore:Title,Year of release|Metascore
        `,
    }),
});
const data = await response.json();
setResult(data.result);

// UNCOMMENT this
// const data =
// 	"\n\nBlade Runner,1982|91\nThe Matrix,1999|83\nThe Terminator,1985|25\nThe Hitchhiker's Guide to the Galaxy,1996|88";
// setResult(data);
```

## running

- `npm run dev`

## dependencies

this project is built using react with [next.js](https://github.com/vercel/next.js/)
