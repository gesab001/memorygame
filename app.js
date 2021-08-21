(function () {

  var Images = {
    getImages: function(){

	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const filename = urlParams.get('filename');
	   var path = "articles/"+filename;
	  console.log("path : " + path);
	  // alert(dropboxtoken);
 	   var dropboxtoken = "ov1Fn0M5gUgAAAAAAAAAAUH__lAitVjxIuHNTfxKDKUvWPyyElPaTre_sLqx26g2";
	   var xhttp = new XMLHttpRequest();
	   xhttp.onreadystatechange = function() {
	     if (this.readyState == 4 && this.status == 200){
	       //syncwithLocalStorage(JSON.parse(this.responseText));
	          var slides = JSON.parse(this.responseText).slides;
                  var jsonobject = {"items": []};
                  for (var x=0; x<slides.length; x++) {
			var name = "name"+x;
                        var id = x;
                        var img = slides[x].image;
                        var item = {"name": name, "img": img, "id": id};
                        jsonobject.items.push(item);
                  }


		  //var jsonobject = JSON.parse(wordliststring);
		  var cards = jsonobject.items;
		  console.log("getImages");
		  console.log(JSON.stringify(cards));	       
	   	  Memory.init(cards);
	     }else{

		 }
	    };
	   xhttp.open("POST", "https://content.dropboxapi.com/2/files/download", true);
	   xhttp.setRequestHeader("Authorization", "Bearer " +dropboxtoken);
	   xhttp.setRequestHeader("Dropbox-API-Arg", "{\"path\": \"/"+path+"\"}");
	   xhttp.send();
	       
	    }
  }
  var Memory = {

    init: function (cards) {
      this.$game = $(".game");
      this.$modal = $(".modal");
      this.$overlay = $(".modal-overlay");
      this.$restartButton = $("button.restart");
      this.cardsArray = $.merge(cards, cards);
      this.shuffleCards(this.cardsArray);
      this.setup();
      this.binding();
    },

    shuffleCards: function (cardsArray) {
      this.$cards = $(this.shuffle(this.cardsArray));
    },

    setup: function () {
      this.html = this.buildHTML();
      this.$game.html(this.html);
      this.$memoryCards = $(".card");
      this.paused = false;
      this.guess = null;
    },

    binding: function () {
      this.$memoryCards.on("click", this.cardClicked);
      this.$restartButton.on("click", $.proxy(this.reset, this));
    },
    // kinda messy but hey
    cardClicked: function () {
      var _ = Memory;
      var $card = $(this);
      if (!_.paused && !$card.find(".inside").hasClass("matched") && !$card.find(".inside").hasClass("picked")) {
        $card.find(".inside").addClass("picked");
        if (!_.guess) {
          _.guess = $(this).attr("data-id");
        } else if (_.guess == $(this).attr("data-id") && !$(this).hasClass("picked")) {
          $(".picked").addClass("matched");
          _.guess = null;
        } else {
          _.guess = null;
          _.paused = true;
          setTimeout(function () {
            $(".picked").removeClass("picked");
            Memory.paused = false;
          }, 600);
        }
        if ($(".matched").length == $(".card").length) {
          _.win();
        }
      }
    },

    win: function () {
      this.paused = true;
      setTimeout(function () {
        Memory.showModal();
        Memory.$game.fadeOut();
      }, 1000);
    },

    showModal: function () {
      this.$overlay.show();
      this.$modal.fadeIn("slow");
    },

    hideModal: function () {
      this.$overlay.hide();
      this.$modal.hide();
    },

    reset: function () {
      this.hideModal();
      this.shuffleCards(this.cardsArray);
      this.setup();
      this.$game.show("slow");
    },

    // Fisher--Yates Algorithm -- https://bost.ocks.org/mike/shuffle/
    shuffle: function (array) {
      var counter = array.length,temp,index;
      // While there are elements in the array
      while (counter > 0) {if (window.CP.shouldStopExecution(0)) break;
        // Pick a random index
        index = Math.floor(Math.random() * counter);
        // Decrease counter by 1
        counter--;
        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
      }window.CP.exitedLoop(0);
      return array;
    },

    buildHTML: function () {
      var frag = '';
      this.$cards.each(function (k, v) {
        frag += '<div class="card" data-id="' + v.id + '"><div class="inside">\
				<div class="front"><img src="' + v.img + '"\
				alt="' + v.name + '" /></div>\
				<div class="back"><img src="https://gesab001.github.io/assets/images/sunset.jpg"\
				alt="Codepen" /></div></div>\
				</div>';
      });
      return frag;
    } };




   Images.getImages();


})();
//# sourceURL=pen.js
