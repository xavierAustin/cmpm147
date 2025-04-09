// project.js - purpose and description here
// Author: Xavier Austin
// Date: 4/7/25

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file


function main() {
  // create an instance of the class
  //let myInstance = new MyProjectClass("value1", "value2");

  // call a method on the instance
  //myInstance.myMethod();
  const fillers = {
	  greeting: ["Greetings!", "Salutations!", "Yo Waddup.", "Hi!", "Hiiiiiiii!", "Sup.", "Hello!"],
	  typeofthing: ["a program", "a weird dog type thing", "a specimen", "a figment of your imagination", "a hatsune miku clone", "an AS (artificial stupid)", "a generative something-or-other", "a rotisserie chicken", "an instance", "a routine", "a protocol", "an AI (NOT the buzzword!)"],
	  livingspace: ["walls", "WiFi router", "mind", "computer", "browser", "device", "screen", "anti-virus", "root directory"],
	  likealive: ["very here", "trying my best", "a great liar", "sorta' sensitive on the topic as a whole and would prefer to change the subject", "not quite dead either", "Jacob", "... no wait thats it", "a close second", "hungry", "close enough", "feeling pretty alright right now"],
	  color: ["blue","green","purple","turquoise","fuchsia","royal purple","lavender","orple","orange","lemon","$generatedcolors$generatedEnd","$generatedcolors$generatedcolors$generatedEnd","$generatedcolors$generatedcolors$generatedcolors$generatedEnd","$generatedcolors$generatedcolors$generatedcolors$generatedcolors$generatedEnd"],
	  generatedcolors: ["mu","pur","ye","gre","bu","by","re"],
	  generatedEnd: ["ish","ple","llow","lue","d"],
	  fruit: ["stawberrys","apples","pears","oranges","lemons","purple","rotisserie chickens"],
	  niceties: ["It's a pleasure to make your acquaintance!", "Lovely meeting you!", "It's nice to meet you!", "I'm cheesed to meat you!", "Uh... Yeah that's it...", "Dab me up slime!", "The pleasure is mine! -And mine only! Die!", "Hiiiiii!"],
	  recursive: ["on and $recursive", "$recursive and $recursive", "on and on", "on and on", "-and... er- on and on"]
	};

	const template = `$greeting $niceties

	I'm $typeofthing living in your $livingspace! While I'm not exactly alive I am $likealive! Here, I'll give you an idea of who I am; my favorite fruits are $fruit and my favorite color is $color!

	Sorry for rambling! I could just go on and $recursive about this!
	`;

	// STUDENTS: You don't need to edit code below this line.

	const slotPattern = /\$(\w+)/;

	function replacer(match, name) {
	  let options = fillers[name];
	  if (options) {
		return options[Math.floor(Math.random() * options.length)];
	  } else {
		return `<UNKNOWN:${name}>`;
	  }
	}

	function generate() {
	  let story = template;
	  while (story.match(slotPattern)) {
		story = story.replace(slotPattern, replacer);
	  }

	  /* global box */
	  $("#box").text(story);
  }
  
  /* global clicker */
  $("#clicker").click(generate);


  generate();
}

// let's get this party started - uncomment me
main();