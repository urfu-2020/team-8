import { createMuiTheme } from "@material-ui/core/styles"

const themeLight = createMuiTheme({
	palette: {
		type: "light",
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
export default themeLight