# SQL Interview Guide — MarketMind Knowledge Base Sample

## JOIN Types

INNER JOIN returns only rows with matching values in both tables.
LEFT JOIN returns all rows from the left table and matched rows from the right.
RIGHT JOIN returns all rows from the right table and matched rows from the left.
FULL OUTER JOIN returns rows when there is a match in either table.

## Common Interview Questions

1. What is the difference between WHERE and HAVING?
   - WHERE filters rows before grouping.
   - HAVING filters groups after GROUP BY.

2. What is an index?
   - A data structure that speeds up SELECT queries on indexed columns.
   - Over-indexing can slow down INSERT and UPDATE operations.

3. Explain ACID properties.
   - Atomicity: all or nothing.
   - Consistency: valid state before and after.
   - Isolation: concurrent transactions do not interfere.
   - Durability: committed data survives crashes.

## Best Practices for IT Interviews

- Always clarify table schemas before writing a query.
- Mention performance: indexes, execution plans, N+1 problems.
- For junior roles, focus on SELECT, JOINs, GROUP BY, and subqueries.
- Practice explaining your thought process out loud.

## Platform Note

This document is part of the MarketMind internal IT knowledge base.
Use it when coaching candidates on SQL fundamentals for data and backend roles.
