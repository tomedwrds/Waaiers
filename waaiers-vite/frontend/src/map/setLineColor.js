export function setLineColor(displayedWindDir,segmentWindDir)
{
    if(displayedWindDir == segmentWindDir || displayedWindDir == 'all')
    {
        if(segmentWindDir == 'cross') return 'yellow'
        if(segmentWindDir == 'tail') return 'red'
        if(segmentWindDir == 'head') return 'blue'
    }
    return 'white'
}