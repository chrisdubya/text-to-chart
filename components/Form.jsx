import { Configuration, OpenAIApi } from "openai";

const Form = () => {
	const handleSubmit = () => {
		// const requestOptions = {
		// 	method: "POST",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 		Authorization: "Bearer " + process.env.NEXT_PUBLIC_OPENAI_API_KEY,
		// 	},
		// 	body: JSON.stringify({
		// 		prompt:
		// 			"A two-column spreadsheet of top science fiction movies and the year of release:Title,Year of release",
		// 		temperature: 0.5,
		// 		max_tokens: 60,
		// 		top_p: 1.0,
		// 		frequency_penalty: 0.0,
		// 		presence_penalty: 0.0,
		// 	}),
		// };
		// fetch(
		// 	"https://api.openai.com/v1/engines/text-davinci-002/completions",
		// 	requestOptions
		// )
		// 	.then((response) => response.json())
		// 	.then((data) => {
		// 		const test = data.choices[0].text;
		// 		const result = test.split(/(?<=\n).*/);
		// 		console.log(result);
		// 		// /^(.*?)abc/
		// 	})
		// 	.catch((err) => {
		// 		console.log("Ran out of tokens for today! Try tomorrow!");
		// 	});

		let data =
			"\n\nBlade Runner,1982\nThe Matrix,1999\nThe Terminator…Worlds,1953\nThe Hitchhiker's Guide to the Galaxy,1990";
		const result = data.substring(1);
		const foo = result.match(/\n(.*)/g);

		let chartData = [];

		for (let i = 0; i < foo.length; i++) {
			let titleQuery = foo[i].match(/(.*),/g);
			let title = titleQuery[0].slice(0, -1);
			let yearQuery = foo[i].match(/,(.*)/g);
			let year = Number(yearQuery[0].substring(1));
			chartData.push({ year: year, title: title });
		}

		console.log(chartData);
	};

	return (
		<button className='text-xl text-blue' onClick={handleSubmit}>
			Click me
		</button>
	);
};

export default Form;
