export function getNodeById(nodeId, unformattedTreeArray) {
    return unformattedTreeArray.find(node => node.id === nodeId);
}

export function treeFormatter(data) {
    let tree = {};
    let roots = [];
    let node;
    let i;
    for (i = 0; i < data.length; i++) {
        tree[data[i].id] = i;
        data[i].children = [];
    }
    for (i = 0; i < data.length; i++) {
        node = data[i];
        if (node.parentId !== null) {
            data[tree[node.parentId]].children.push(node);
        } else {
            roots.push(node);
        }
    }
    return roots[0];
}

export function getNodeColorByEntityType(isSelected, isSearchResult, entityType) {
    switch (entityType) {
        case 'horizon':
            return '#b83a3a';
        case 'injection':
            return '#e09f2e';
        case 'lever':
            return '#0b664cbd';
        case 'strategy':
            return '#1d68b3';
        default:
            return '#5e4eca';
    }
    
}

export function getNodeStrokeByEntityType(entityType, isSelected, isSearchResult) {
    var SHADE_SHIFT_AMOUNT = 0.1; 
    let percent = -30
    let color;

    switch (entityType) {
        case 'horizon':
            color = '#b83a3a';
            break;
        case 'injection':
            color = '#e09f2e';
            break;
        case 'lever':
            color = '#0b664cbd';
            break;
        case 'strategy':
            color = '#1d68b3';
            break;
        default:
            color = '#5e4eca';
            break
    }

    
    var R = parseInt(color.substring(1,3),16);
    var G = parseInt(color.substring(3,5),16);
    var B = parseInt(color.substring(5,7),16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R<255)?R:255;  
    G = (G<255)?G:255;  
    B = (B<255)?B:255;  

    var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    if(isSelected) return "#"+RR+GG+BB;
    if(isSearchResult) return 'black'
}

export function getNodeStrokeWidth(isSelected, isSearchResult) {
    if(isSearchResult) return 7;

    if (isSelected)
    {
        return 5;
    }

    return 0;
}

export function addBlurFilter(svg) {
    var defs = svg.append("defs");

    var filter = defs.append("filter").attr("id","glow");
    filter.append("feGaussianBlur").attr("stdDeviation","3.5").attr("result","coloredBlur");

    var feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in","coloredBlur");
    feMerge.append("feMergeNode").attr("in","SourceGraphic");
}

