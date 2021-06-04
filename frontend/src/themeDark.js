import { createMuiTheme } from "@material-ui/core/styles"

const themeDark = createMuiTheme({
	palette: {
		type: "dark",
	},
	spacing: 8,
	overrides: {
		MuiPaper: {
			root: {
				padding: "20px",
				margin: "10px 0px 10px 0px",
				height: "100%",
			},
		},    
	},
})
export default themeDark