

'h1' // title

if (location.host != 'paulirish.com'){
  return;
  
}
 
var titles = [];
for (var i = 0; i < urls.length; i++){
  // get HTML content.. 
  $(document.body).load('../proxy.php?mode=native&url='+urls[i]+' h1', function(d){ 
     console.log(document.body.innerText);
     titles.push(document.body.innerText)
  })
}

// get Image
$('<div>').load('../proxy.php?url='+url,function(d){ 
    var img = ''
    try {
      img = $.parseJSON(d).contents.match(/"(http:\/\/.*?xwide\.jpg)"/)[1];
    }
    
})

// todo.. localstorage


var titles = ["Countdown to Mine Rescue: Chile Miners Prepare to Be Lifted Into Sunlight", "The Art of the Deal: How to Haggle for a Used Car", "Special Needs Students Becoming Homecoming Royalty", "Exclusive: After Broken Arm, Boy Cheerleader Still Threatened", "Death for Petit Family Murderer Steven Hayes? Penalty Phase Looms", "Exclusive: 'Catfish's' Angela Wesselman Speaks Out", "'World News' Political Insights -- Outspent Democrats Blast Campaign Rules", "Damage Control: Meg Whitman and the Latino Vote", "House Candidate Rich Iott Defends Nazi Uniform Photos", "Looking for Work? Expect a Lower Salary", "C-4 Explosives Found in Historic New York Cemetery", "Faking It? New Sex Study May Rat You Out", "Here's 'The Situation': Mike Sorrentino Talks About Possibly Leaving 'Jersey Shore'", "Solomon Burke Dies at Amsterdam Airport at 70", "The Conversation: On the Ground in Chile", "Mortgage Bullies?: Banks Accused of Illegally Breaking Into Homes Facing Foreclosure", "100-Year-Old Scotch Pulled From Frozen Crate", "Men Allegedly Scammed by So-Called Military Mistress Speak Out", "No-Holds-Barred Fight: Connecticut Senate Race Tightens", "Sex Offenders Find Safe Haven in 'Miracle Village'"];


var urls = [
  'http://abcnews.go.com/International/chilean-miners-officials-prepare-escape-shaft-trapped-men/t/story?id=11847430'
, 'http://abcnews.go.com/US/special-students-elected-homecoming-king-queen/t/story?id=11846254'
, 'http://abcnews.go.com/GMA/Savings/art-deal-haggle-car/t/story?id=11845530'
, 'http://abcnews.go.com/Nightline/jersey-shores-mike-situation-sorrentino-talks-reality-tv/t/story?id=11849998'
, 'http://abcnews.go.com/2020/catfish-woman-angela-wesselman-twisted-cyber-romance-abc/t/story?id=11831583'
, 'http://abcnews.go.com/US/TheLaw/death-petit-family-murderer-penalty-phase-looms/t/story?id=11810566'
, 'http://abcnews.go.com/GMA/TheLaw/exclusive-broken-arm-boy-cheerleader-threatened/t/story?id=11753915'
, 'http://abcnews.go.com/WN/world-news-political-insights-outspent-democrats-blast-campaign/t/story?id=11846054'
, 'http://abcnews.go.com/Entertainment/t/story?id=11843594'
, 'http://abcnews.go.com/GMA/WaterCooler/t/story?id=11390959'
, 'http://abcnews.go.com/Politics/meg-whitman-latino-vote/t/story?id=11785737'
, 'http://abcnews.go.com/Health/Sex/sex-surveys-masturbation-sheets-america/t/story?id=11776702'
, 'http://abcnews.go.com/Politics/tea-party-nazi-reenactor-rick-iott-defends/t/story?id=11845422'
, 'http://abcnews.go.com/Blotter/explosives-found-historic-york-cemetery/t/story?id=11852963'
, 'http://abcnews.go.com/Business/Savings/pay-raise-economy-improves-expect-lower-wages/t/story?id=11835144'

// with video content...
, 'http://abcnews.go.com/Business/banks-accused-illegally-breaking-homes-facing-foreclosure/t/story?id=11847377'
, 'http://abcnews.go.com/WN/chilean-miners-rescue-camp-hope-world-news-conversation/t/story?id=11850572'
, 'http://abcnews.go.com/ThisWeek/holds-barred-fight-connecticut-senate-race-tightens/t/story?id=11844085'
, 'http://abcnews.go.com/Nightline/sex-offenders-find-safe-haven-florida-pastors-miracle/t/story?id=11776332'
, 'http://abcnews.go.com/2020/TheLaw/men-scammed-called-military-mistress-bobbi-ann-finley/t/story?id=11701771'




];