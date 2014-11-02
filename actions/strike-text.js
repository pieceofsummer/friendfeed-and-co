registerAction(function (node) {
	if (!settings["strikeText"]) return;

	if (node) 
	{
		node = closestParent(node, ".l_entry", true);
		if (!node) return;
	} 
	else
		node = document.body;
	
	toArray(node.querySelectorAll(
		".l_entry .ebody > .title > .text, " +
		".l_entry .comments .comment .content")).forEach(function(node) {
		var c = node.firstChild,
			re1 = /<s>(.+?)<\/s>/,
			re2 = /<strike>(.+?)<\/strike>/;
		while (c) {
			if (c.nodeType == Node.TEXT_NODE && (re1.test(c.nodeValue) || re2.test(c.nodeValue))) {
				var str = c.nodeValue,
					fr = document.createDocumentFragment(),
					m, m1, m2;
				while (true) {
					m1 = re1.exec(str);
					m2 = re2.exec(str);
					if (m1 === null && m2 === null) break;
				
					// get best match
					if (m1 === null)
						m = m2;
					else if (m2 === null)
						m = m1;
					else
						m = (m1.index < m2.index) ? m1 : m2;
					
					var match = m[0], strokeText = m[1], off = m.index;
					fr.appendChild(document.createTextNode(str.substring(0, off)));
					str = str.substring(off + match.length);

					var s = fr.appendChild(document.createElement("s"));
					s.appendChild(document.createTextNode(strokeText));
				}
				var lastCh = fr.appendChild(document.createTextNode(str));
				node.insertBefore(fr, c);
				node.removeChild(c);
				c = lastCh;
			}
			c = c.nextSibling;
		}
		node.normalize();
	});
});