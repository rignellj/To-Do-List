exports.get_date = function() {
  const today = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  return (today.toLocaleDateString("en-US", options));
}

exports.get_day = function() {
  const today = new Date();
  const options = {
    weekday: "long"
  };
  return (today.toLocaleDateString("en-US", options));
}
