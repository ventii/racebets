$.ajaxSetup({ cache: false });

var activeFilters = ['g','j','t'];


var raceWidget = new class RaceWidget{

    static toEuro(value){
        return value * 1.12;
    }

    constructor(){
        this.getNextRace();   
    }   

    getNextRace(){
        $.getJSON('/races')
        .done((resp) =>{
           if(resp.status != "success")
           {
               alert('could not get data :( please make sure node server is running on port 8000!');
           } 
           else{
               this.races = resp.data.races;
               this.nextRace = this.getRaceHighestPurse();
               this.drawRace();               
           }
        });
    }

    showNoData(){
        $("#next-race-widget .loader").hide();
        $("#next-race-widget .race-data").hide();
        $("#next-race-widget .nodata").show();
        
    }

    hideLoader(){
        $("#next-race-widget .loader").hide();
        $("#next-race-widget .nodata").hide();
        $("#next-race-widget .race-data").fadeIn(300);
    }
    
    getRaceHighestPurse(){
        
        let nextRace = null;
        
        $.each(this.races, (index, race) => {

            if(activeFilters.indexOf(race.race_type.toLowerCase()) > -1)
            {
                if(nextRace != null)
                {
                    let nextRacePurse = nextRace.purse.currency == "GBP" ? RaceWidget.toEuro(nextRace.purse.amount) : nextRace.purse.amount;
                    let racePurse = race.purse.currency == "GBP" ? RaceWidget.toEuro(race.purse.amount) : race.purse.amount;
    
                    if(nextRacePurse > racePurse)
                        return;
                }
                
                nextRace = race;   
            }
              
        });

        return nextRace;
    }

    drawRace(){
        
        let race = this.nextRace;

        if(race == null)
        {
            this.showNoData();
            return;
        }
        
        let $header = $("#next-race-widget .header");
        let $title = $("#next-race-widget .title");
        let $bodyList = $("#next-race-widget .body > ul");

        $("#next-race-widget .race-link").attr("href", "http://www.racebets.com/bet/" + race.id_race)
                                         .attr("target", "_blank");

        $header.find(".event-title").text(race.event.title);
        $header.find(".flag").attr("class", "flag " + race.event.country);
        $header.find(".time-remaining").text(moment.unix(race.post_time).fromNow());
        
        $title.find(".runners-count").text(race.num_runners + " runners");
        $title.find(".distance").text(race.distance.toLocaleString("en").split('.')[0] + " m");
        $title.find(".purse").text(race.purse.amount.toLocaleString("en").split('.')[0] + " " + race.purse.currency.toLocaleString("en"));
        $title.find(".type-icon").attr("class","type-icon type-" + race.race_type.toLowerCase());

        $bodyList.empty();
        
        let drawSilk = true;
        let listArray = [];
        $.each(race.runners, (index, runner) =>{
            
            if(drawSilk && runner.silk.length <= 0){
                drawSilk = false;
            }

            let $li = $("<li>");

            if(drawSilk)
            {
                let $divSilk = $("<div>", {class: "silk"});
                $divSilk.append($("<a>", {href:"http://www.racebets.com/bet/" + race.id_race, target: "_blank"}).append($("<span>", {class: "silk-image silk-" + runner.silk.replace(".png","")})));
                $li.append($divSilk);
            }

            let $divRunner = $("<div>", {class: "runner"})
            $divRunner.append($("<a>", {href:"http://www.racebets.com/bet/" + race.id_race, target: "_blank"}).append(runner.name));            
            $li.append($divRunner);
            
            let $divOdds = $("<div>", {class: "odds"});
            $divOdds.append($("<a>", {class: "button-bet", href: "http://www.racebets.com/bet/" + race.id_race, target: "_blank"})
                    .append($("<span>", {class: "odds-amount"})
                    .append(runner.odds)));
            $li.append($divOdds);
            
            listArray.push($li);
        });

        $bodyList.append(listArray);

        this.hideLoader();
    }

}

$(() =>{   
    
    var socket = io();

    socket.on("race added", (message) => {
        raceWidget.getNextRace();
    });
    
    $(".list-filters a").on("click", toggleFilter);

    $("#socketbutton").on("click", postDummy);

});

function toggleFilter(e){    
    e.preventDefault();  

    let $element = $(this);
    let raceType = $element.data("racetype");
    let index = activeFilters.indexOf(raceType)

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
    
    raceWidget.getNextRace();
}

function postDummy(e){
    e.preventDefault();

    $.post( "/race", (data) => {
        //do nothing. let socket io to the work for demonstration.
      });
}