All rights reserved. 

The Good Boi Bot is mine and if you use it and don't tell me, you are most definetly not a good boi.

Run your MongoDB+NodeJS instance to make the bot work like a good boi.

The Boi computes the market RANK according the following rules:

- a variation greater than config.SPIKE is named a SPIKE
- a negative SPIKE followed by a positive SPIKE is +1 RANK
- a negative SPIKE followed by another negative SPIKE is -1 RANK

The Boi buys and sells according the following rules:

- if a market has RANK > config.ALERTRANK or (RANK = config.ALERTRANK and last spike was negative) => the good boi buys the currency
- if a market has a positive SPIKE AND there is an outstanding transaction on that market AND the estimated gain is > 0 => the good boi sells the currency

That's it.



