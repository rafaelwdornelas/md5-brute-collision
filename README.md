# md5-clash
Checks MD5 collission in nodejs

```sh
node index.js 5
```

Output:

```
Working directory: /home/projects/sdesalas/md5-clash/hashes
Checking strings up to 5 chars.
Chars: 1, 0 items/second
Chars: 2, 2571 items/second
Chars: 3, 34105 items/second
Chars: 4, 52552 items/second
Chars: 5, 24562 items/second
Done!
```

Note that this process creates a lot of files in the `/hashes` directory. One for each hash. 

Why? 

Because most computers will run out of memory if we use memory to store every hash being generated. 
