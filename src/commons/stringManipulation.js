const capitalizeFirstLetter = (name) => {
    if (!name) return ''; // Handle empty or undefined names
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  export { capitalizeFirstLetter };