const classNameArray = ['.description', '.descriptionNode', '.node', '.label', '.tactics', '.tacticsNode', '.link', '.menu1', '.menu2', '.menu3'];
const classHideDescription = ['.description', '.descriptionNode', '.tactics', '.tacticsNode', '.labelName', '.menu1', '.menu2', '.menu3'];
const classRemoveDuplicate = ['description', 'label', 'tactics'];
const classHideEmtyClassText = ['tacticsText', 'tacticsText'];
const classHideEmtyClassNode = ['tacticsNode', 'tactics'];

//transform effect to transition into detailed view
export function renderNode(ref, tree, nodeId, nodeX, nodeY, width, height, color, stroke, nodeStrokeWidth, zoomState, wordCloudInitialiser) {
    return ref
        .selectAll('.node')
        .data(tree.descendants())
        .join('rect')
        .attr('class', 'node')
        .attr('id', nodeId)
        .attr('width', width)
        .attr('height', height)
        .attr('x', nodeX)
        .attr('y', nodeY)
        .attr('border-radius', '8px 8px 0')
        .attr('fill', color)
        .style('cursor', 'pointer')
        .attr('stroke', stroke)
        .attr('stroke-width', nodeStrokeWidth)
        .attr('transform', 'scale(' + zoomState + ')')
        .attr('rx', '10')
        .attr('rx', '10')
        //.style("filter", "url(#glow)")
        .attr('tag', wordCloudInitialiser)
}

export function renderLabel(ref, tree, nodeX, nodeY, width, height, zoomState, referenceId, name, stroke, nodeStrokeWidth) {
    return ref
        .selectAll('.label')
        .data(tree.descendants())
        .join('foreignObject')
        .attr('class', 'label')
        .attr('ref', 'labeling')
        .attr('x', nodeX)
        .attr('y', nodeY)
        .attr('width', width)
        .attr('height', height) 
        .attr('fill', 'transparent')
        .attr('transform', 'scale(' + zoomState + ')')
        .style("pointer-events","none")
        .append('xhtml:div')
        .attr('ref', 'labeling')
        .attr('class', 'labelText')
        .attr('padding', '5px')
        .attr('fill', 'transparent')
        .attr('stroke', stroke)
        .attr('stroke-width', nodeStrokeWidth)
        .style("pointer-events","none")
        .text(referenceId)
        .append('foreignObject')
        .attr('class', 'labelName')
        .attr('ref', 'labeling')
        .attr('fill', 'transparent')
        .style("pointer-events","none")
        .text(name)
        .raise();
}

// This renders the actual menu button
export function renderMenu1(ref, tree, nodeX, nodeY, width, height, zoomState) {
    return ref
        .selectAll('.menu1')
        .data(tree.descendants())
        .join('rect')
        .attr('class', 'menu1')
        .attr('id', 'menu1')
        .attr('width', width)
        .attr('height', height)
        .attr('x', nodeX)
        .attr('y', nodeY)
        .style('fill', 'white')
        .style("pointer-events","visible")
        .attr('transform', 'scale(' + zoomState + ')')
        .raise()
}

export function renderMenu2(ref, tree, nodeX, nodeY, width, height, zoomState) {
    return ref
        .selectAll('.menu2')
        .data(tree.descendants())
        .join('rect')
        .attr('class', 'menu2')
        .attr('id', 'menu2')
        .attr('width', width)
        .attr('height', height)
        .attr('x', nodeX)
        .attr('y', nodeY)
        .style('fill', 'white')
        .style("pointer-events","visible")
        .attr('transform', 'scale(' + zoomState + ')')
        .raise()
}

export function renderMenu3(ref, tree, nodeX, nodeY, width, height, zoomState) {
    return ref
        .selectAll('.menu3')
        .data(tree.descendants())
        .join('rect')
        .attr('class', 'menu3')
        .attr('id', 'menu3')
        .attr('width', width)
        .attr('height', height)
        .attr('x', nodeX)
        .attr('y', nodeY)
        .style('fill', 'white')
        .style("pointer-events","visible")
        .attr('transform', 'scale(' + zoomState + ')')
        .raise()
}

export function renderDescription(ref, tree, nodeX, nodeY, width, height, zoomState, stroke, nodeStrokeWidth, description) {
    return ref
        .selectAll('.description')
        .data(tree.descendants())
        .join('foreignObject')
        .attr('class', 'description')
        .attr('x', nodeX)
        .attr('y', nodeY)
        .attr('stroke', stroke)
        .attr('stroke-width', nodeStrokeWidth)
        .attr('width', width)
        .attr('height', height)
        .attr('transform', 'scale(' + zoomState + ')')
        .append('xhtml:div')
        .attr('class', 'descriptionText')
        .text(description)
        .raise();
}

//Needs modification
//This changes the text inside each node
/*
export function renderDescriptionNode(ref, tree, nodeX, nodeY, color, zoomState) {
    return ref
        .selectAll('.descriptionNode')
        .data(tree.descendants())
        .join('rect')
        .attr('class', 'descriptionNode')
        .attr('id', 'descriptionNode')
        .attr('width', 180)
        .attr('height', 140)
        .attr('x', nodeX)
        .attr('y', nodeY)
        .attr('rx', '10')
        .attr('rx', '10')
        .attr('fill', '#f2f2f2')
        .attr('transform', 'scale(' + zoomState + ')');
}
*/

export function renderDescriptionNode(ref, tree, nodeX, nodeY, width, height, stroke, nodeStrokeWidth, zoomState) {
    return ref
        .selectAll('.descriptionNode')
        .data(tree.descendants())
        .join('rect')
        .attr('class', 'descriptionNode')
        .attr('id', 'descriptionNode')
        .attr('width', width)
        .attr('height', height)
        .attr('x', nodeX)
        .attr('y', nodeY)
        .attr('rx', '10')
        .attr('rx', '10')
        .attr('fill', '#f2f2f2')
        //.attr('stroke', stroke)
        //.attr('stroke-width', nodeStrokeWidth)
        .attr('transform', 'scale(' + zoomState + ')')
        //.style("filter", "url(#glow)")
}

export function renderTactics(ref, tree, nodeX, nodeY, width, height, zoomState, stroke, nodeStrokeWidth, tactic) {
    return ref
        .selectAll('.tactics')
        .data(tree.descendants())
        .join('foreignObject')
        .attr('class', 'tactics')
        .attr('x', nodeX)
        .attr('y', nodeY)
        .attr('width', width)
        .attr('height', height)
        .attr('stroke', stroke)
        .attr('stroke-width', nodeStrokeWidth)
        .attr('transform', 'scale(' + zoomState + ')')
        .append('xhtml:div')
        .attr('class', 'tacticsText')
        .text(tactic)
        .raise();
}

export function renderTacticsNode(ref, tree, nodeX, nodeY, width, height, zoomState, stroke, nodeStrokeWidth) {
    return ref
        .selectAll('.tacticsNode')
        .data(tree.descendants())
        .join('rect')
        .attr('class', 'tacticsNode')
        .attr('id', 'tacticsNode')
        .attr('width', width)
        .attr('height', height)
        .attr('x', nodeX)
        .attr('y', nodeY)
        .attr('fill', '#f2f2f2')
        .attr('rx', '10')
        .attr('rx', '10')
        .attr('transform', 'scale(' + zoomState + ')');
}

export function renderPath(svg, tree, generator, zoomState) {
    svg.selectAll('.link')
        .data(tree.links())
        .join('path')
        .attr('class', 'link')
        .attr('d', generator)
        .attr('transform', 'scale(' + zoomState + ')')
        .attr('opacity', '0')
        .style("pointer-events","none")
        .lower();
}

export function transformWhenZoom(svg, currentZoomState) {
    classNameArray.forEach(item => {
        svg.selectAll(item).attr(
            'transform',
            'translate(' + currentZoomState.x + ',' + currentZoomState.y + ') scale(' + currentZoomState.k + ')'
        );
    });
}

export function hideDescriptionAndTacticsWhenZoom(svg) {
    classHideDescription.forEach(item => {
        svg.selectAll(item).remove();
    })
    svg.selectAll('.labelText').style('padding','9px').style('font-size','24px');
}

function removeDuplicate(dom) {
    for (let i = 0; i < dom.length; i++) {
        if (dom[i].childNodes.length > 1) {
            dom[i].removeChild(dom[i].firstChild);
        }
    }
}

export function removeDuplicateDOM() {
    classRemoveDuplicate.forEach(item => {
        removeDuplicate(document.getElementsByClassName(item));
    });
}

function getIndexEmtyElement(textClass) {
    let z = 0;
    let arrSaveIndexRemove = [];
    for (let i of document.getElementsByClassName(textClass)) {
        i.id = z;
        z += 1;
        if (i.innerHTML === '') arrSaveIndexRemove.push(i.id);
    }
    return arrSaveIndexRemove;
}

function getIndexNonEmptyElement(textClass) {
    let z = 0;
    let arrSaveIndex = [];
    for (let i of document.getElementsByClassName(textClass)) {
        i.id = z;
        z += 1;
        if (i.innerHTML !== '') arrSaveIndex.push(i.id);
    }
    return arrSaveIndex;
}

function hideEmptyNodesByClassName(textClass, background) {
    let classArray = getIndexEmtyElement(textClass);
    for (let k of classArray) {
        document.getElementsByClassName(background)[k].style.display = 'none';
    }
}

export function hideEmptyDescriptionTactics() {
    for (let i = 0; i < classHideEmtyClassText.length; i++) {
        hideEmptyNodesByClassName(classHideEmtyClassText[i], classHideEmtyClassNode[i]);
    }
}

export function expandLabelCoverTactics(label, background, width) {
    let classArray = getIndexNonEmptyElement(label);
    for (let element of classArray) {
        document.getElementsByClassName(background)[element].width.baseVal.value = width;
        document.getElementsByClassName('tactics')[element].style.display = 'block';
        document.getElementsByClassName('tacticsNode')[element].style.display = 'block';
    }
}
