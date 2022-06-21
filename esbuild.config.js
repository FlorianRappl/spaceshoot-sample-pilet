module.exports = options => {
  options.loader['.ttf'] = 'file';
  options.loader['.eot'] = 'file';
  options.loader['.otf'] = 'file';
  options.loader['.woff'] = 'file';
  return options;
};
