/**
 * Jquery language selector plugin.
 *
 * @author   Muhammad Umer Farooq <lablnet01@gmail.com>
 * @author-profile https://www.facebook.com/Muhammadumerfarooq01/
 *
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 * @license MIT
 */
// Javascript program to print DFS
// traversal from a given
// graph
//
// This class represents a
// directed graph using adjacency
// list representation
//class Graph
//{
//
//	// Constructor
//	constructor(v)
//	{
//		this.V = v;
//		this.adj = new Array(v);
//		for(let i = 0; i < v; i++)
//			this.adj[i] = [];
//	}
//
//	// Function to add an edge into the graph
//	addEdge(v, w)
//	{
//
//		// Add w to v's list.
//		this.adj[v].push(w);
//	}
//
//	// A function used by DFS
//	DFSUtil(v, visited)
//	{
//
//		// Mark the current node as visited and print it
//		visited[v] = true;
//		if()
//        var l = new LanguageSelector();
//        $(document).on("change", "#langSelector", function () {
//          var s = $(this).children("option:selected").val();
//          l.setLang(s);
//          location.reload();
//        });
//
//		// Recur for all the vertices adjacent to this
//		// vertex
//		for(let i of this.adj[v].values())
//		{
//			let n = i
//			if (!visited[n])
//				this.DFSUtil(n, visited);
//		}
//	}
//
//	// The function to do DFS traversal.
//	// It uses recursive
//	// DFSUtil()
//	DFS(v)
//	{
//
//		// Mark all the vertices as
//		// not visited(set as
//		// false by default in java)
//		let visited = new Array(this.V);
//		for(let i = 0; i < this.V; i++)
//			visited[i] = false;
//
//		// Call the recursive helper
//		// function to print DFS
//		// traversal
//		this.DFSUtil(v, visited);
//	}
//}

//function dfsTraversal(node, parse) {
//  parse(node); // Do something with the current node
//
//  node = node.firstChild;
//  while (node) {
//    dfsTraversal(node, callback); // Recursively traverse the child nodes
//    node = node.nextSibling;
//  }
//}
//
//// Usage Example:
//dfsTraversal(document.body, function(node) {
//  console.log(node.nodeName);
//});
//

class LanguageSelector {
	setLang(lang)
	{
		l = lang.toLowerCase();
		localStorage.setItem('lang', l);
		return true;
	}
	getLang()
	{
		var lang = localStorage.getItem('lang');
		if (lang != null) {
			return lang;
		} else {
			return 'en';
		}
	}
	removeLang()
	{
		localStorage.removeItem('lang');

		return true;
	}
	loadLang()
	{
		var l = this.getLang();
		var strs = lang[l];

		return strs;
	}
	parse(node)
	{
		var rtl = ['ar', 'ur', 'fa', 'he', 'arc', 'az', 'dv', 'arabic', 'aramaic', 'azeri', 'maldivian', 'dhivehi', 'hebrew', 'kurdish', 'persian', 'urdu'
		];
		var lang = this.loadLang();
		var len = lang.length - 1;
		var keys = Object.keys(lang);
		var values = Object.values(lang);
		for (var i = 0; i <= keys.length - 1; i++) {
		    if(node.id == 'except-change-language' || node.tagName == "A")
		        node.innerHTML = node.innerHTML.replaceAll(keys[i],values[i]);
		    else
		        node.innerText = node.innerText.replaceAll(keys[i],values[i]);
		}

		if (rtl.includes(this.getLang())) {
			document.body.style.direction = 'rtl';
		}
		return true;
	}
	dfsTraversal(node) {
	      if(node.childNodes.length == 1){
            this.parse(node); // Do something with the current node
            return true;
          }else{
              node = node.firstChild;
              while (node) {
                        this.dfsTraversal(node); // Recursively traverse the child nodes
                        node = node.nextSibling;
                }
              }
          }
}