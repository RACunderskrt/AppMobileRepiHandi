async windowAvailable(){
    let activites= [
        {
            capa: 2,
            start: new Date('2023-12-16 10:00:00Z'),
            end: new Date('2023-12-16 12:00:00Z')
        },
        {
            capa: 3,
            start: new Date('2023-12-16 11:00:00Z'),
            end: new Date('2023-12-16 13:00:00Z')
        },
        {
            capa: 5,
            start: new Date('2023-12-16 14:00:00Z'),
            end: new Date('2023-12-16 15:00:00Z')
        },
        {
            capa: 2,
            start: new Date('2023-12-16 16:00:00Z'),
            end: new Date('2023-12-16 18:00:00Z')
        },
    ]
    let tstemp = []
    for(let a of activites){
        this.isInArray(tstemp, a.start) ? null : tstemp.push(a.start)
        this.isInArray(tstemp, a.end) ? null : tstemp.push(a.end)
    }
    tstemp.sort()
    let resArr = []
    for(let i = 0; i< tstemp.length-1; i++){
        const found = activites.filter((element) => (tstemp[i] <= element.start && element.start < tstemp[i+1]) ||  (tstemp[i] < element.end && element.end <= tstemp[i+1]));
        let res = 5
        found.forEach((element) => res -= element.capa)
        resArr.push(res)
    }
    console.log(tstemp)
    console.log(resArr)
}

isInArray(array, value) {
    return !!array.find(item => {return item.getTime() == value.getTime()});
  }