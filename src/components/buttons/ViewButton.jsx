import { Box } from "@mui/material";
import { Link } from "react-router-dom";

const ViewButton = (props) => {
    return (
        <Box className="text-center mt-4">
          <Link
            to={props.link}
            className="inline-block px-8 py-3 mt-4 border border-black transition-all duration-700 ease-in-out rounded-sm hover:bg-black hover:text-white hover:shadow-custom text-sm font-medium dark:hover:bg-white dark:hover:text-black dark:border-white"
          >
            {props.text}
          </Link>
        </Box>
    );
}

export default ViewButton;