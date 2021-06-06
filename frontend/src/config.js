export default function getConfig() {
	/*return {
		client_id: "61077180f9138ecc41ee",
		redirect_uri: "http://messenger.urfu.surge.sh/login",
		proxy_url: "https://messenger-ufru-course.herokuapp.com/api/authenticate",
		host: "https://messenger-ufru-course.herokuapp.com"
	}*/
	return {
		client_id: "f4fbae41dc2a65abe43e",
		redirect_uri: "http://localhost:3000/login",
		proxy_url: "http://localhost:5000/api/authenticate",
		host: "http://localhost:5000"
	}
}
