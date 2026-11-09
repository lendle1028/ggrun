let { parse, stringify }=require('smol-toml');
console.log(parse);

sampleToml=`
[tasks.default]
run="test1"
next="A"

[tasks.A]
run="test2"
next."-1"="B"
next."-2"="C"
next."0"="D"

[tasks.B]
run="test3"
next="C"

[tasks.C]
daemon="test4"
next="D"

[tasks.D]
run="test5"
wait_port=[5000, 9000, 100]
clean_port=[5000, 9000, 100]
`;

console.log(parse(sampleToml));