import SearchBar from '@/components/SearchBar';
import HeroCarousel from '@/components/HeroCarousel';
import { getAllProducts } from '@/lib/actions';
import ProductCard from '@/components/ProductCard';

const Home = async () => {

  const allProducts = await getAllProducts();
  return (
  <>
    <section className='px-6 md:px-20 pt-16 pb-20'>
      <div className='flex flex-col'>
          <HeroCarousel />
          <div className='flex flex-col pt-[3rem]'>
            <p className='small-text'>
              Smart Shopping Starts Here →
            </p>
            <h1 className='head-text'>
              Track the Prices with
              <span className='text-primary'> TrackerDo</span>
            </h1>
            <p className='mt-6 ml-2'>
              Track any product price and buy at its best worth. No more manually checking the prices now.
            </p>
            <SearchBar />
          </div>
      </div>
    </section>

    <section className='trending-section'>
      <h2 className='section-text'>Recently Added:</h2>
      <div className='flex flex-wrap justify-center gap-x-8 gap-y-16'>
        {allProducts?.sort((a, b) => (a.addedAt.getTime() < b.addedAt.getTime()) ? 1 : -1).map((product) => (
          <ProductCard key={product._id} product= {product}/>
        ))
        }
      </div>
    </section>
  </>
  )
}

export default Home;
