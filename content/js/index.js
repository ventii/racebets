var activeFilters = ['g','j','t'];



var raceWidget = new class RaceWidget{
    
    constructor(){
        
        $.getJSON('../next_races.json', function(data){
            debugger;
            alert(JSON.stringify(data));
        })
    }

}

$(() =>{
    

    $(".list-filters a").on("click", toggleFilter);
});

function toggleFilter(e){    
    e.preventDefault();  

    $element = $(this);
    raceType = $element.data("racetype");
    index = activeFilters.indexOf(raceType)

    if(index > -1)
    {
        $element.removeClass("active");
        activeFilters.splice(index, 1);
    }
    else
    {
        $element.addClass("active");
        activeFilters.push(raceType);
    }   
    
    alert(raceWidget.testing);
}
