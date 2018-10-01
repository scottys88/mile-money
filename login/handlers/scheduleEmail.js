const schedule = require('node-schedule')

exports.scheduledEmail = schedule.scheduleJob({hour: 11, minute: 19, dayOfWeek: 1}, async function(){
    const athletes = await Athlete.find({notifications: true});
    console.log(athletes);
    athletes.forEach(athlete => {
      const athleteCommutes = athlete.commutes;
      const commuteCosts = athlete.commuteCosts;
      let mileMoneyBalance = 0;
      athleteCommutes.forEach(commute => {
        commuteCosts.forEach(cost => {
          if(commute.commuteCosts == cost.userCommute){
            mileMoneyBalance += cost.totalCost;
            console.log(cost.totalCost);
            console.log(mileMoneyBalance);
            }
        });
      });
      mail.send({
   
        from: 'Mile Money <noreply@milemoney.io>',
        to: athlete.email,
        subject: "You've almost reached a Mile Money goal!",
        html: `Your Mile Money Balance is currently:  ${mileMoneyBalance}`
    
    });
    })
  
  });