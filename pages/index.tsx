import type { NextPage } from "next";
import Chart from "../components/Chart";
import Form from "../components/Form";

const Home: NextPage = () => {
	return (
		<>
			<Form />
			<Chart />
		</>
	);
};

export default Home;
