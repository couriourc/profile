import yaml from 'js-yaml';
import * as map from 'unist-util-map';

export default function yamlPlugin(options) {
  options = options || {};

  function transformer(ast) {
    return map.map(ast, function(node) {
      if (node.type == 'yaml') {
        var parsedValue = {};
        try {
          parsedValue = yaml.load(node.value, 'utf8');
        } catch {
          console.warn('yaml parse error: ' + node.type);
        }
        const newNode = Object.assign({}, node, { data: { parsedValue: parsedValue } });
        return newNode;
      } else {
        return node;
      }
    });
  }

  // Stringify for yaml
  var Compiler = this.Compiler;

  if (Compiler != null) {
    var visitors = Compiler.prototype.visitors;
    if (visitors) {
      visitors.yaml = function(node) {
        if (node.data && node.data.parsedValue) {
          var yml = yaml.dump(node.data.parsedValue);
          return '---\n' + yml + '---';
        }
      };
    }
  }

  return transformer;
};


